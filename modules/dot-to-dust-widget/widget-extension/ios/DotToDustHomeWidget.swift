import SwiftUI
import WidgetKit

private let widgetSnapshotKey = "widget-snapshot"

struct PersistedWidgetSnapshot: Decodable {
  let schemaVersion: Int
  let snapshot: WidgetSnapshot
}

struct WidgetSnapshot: Decodable {
  let kind: String
  let view: String?
  let lived: Int?
  let total: Int?
  let percent: Int?
  let progress: Double?
  let bonus: Bool?
  let display: WidgetDisplay?
  let colors: WidgetColors?
  let dots: [WidgetDot]?
  let cta: String?
}

struct WidgetDisplay: Decodable {
  let hero: String
  let percent: String
  let viewLabel: String
}

struct WidgetColors: Decodable {
  let stages: [String]
  let future: String
  let ring: String
  let accent: String
}

struct WidgetDot: Decodable, Identifiable {
  var id = UUID()
  let stage: Int?
  let isToday: Bool?
  let kind: String?

  enum CodingKeys: String, CodingKey {
    case stage
    case isToday
    case kind
  }
}

struct DotToDustEntry: TimelineEntry {
  let date: Date
  let snapshot: WidgetSnapshot?
}

struct DotToDustProvider: TimelineProvider {
  func placeholder(in context: Context) -> DotToDustEntry {
    DotToDustEntry(date: Date(), snapshot: nil)
  }

  func getSnapshot(in context: Context, completion: @escaping (DotToDustEntry) -> Void) {
    completion(DotToDustEntry(date: Date(), snapshot: readSnapshot()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<DotToDustEntry>) -> Void) {
    let entry = DotToDustEntry(date: Date(), snapshot: readSnapshot())
    let next = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
    completion(Timeline(entries: [entry], policy: .after(next)))
  }

  private func readSnapshot() -> WidgetSnapshot? {
    guard
      let appGroupIdentifier = Bundle.main.object(forInfoDictionaryKey: "AppGroupIdentifier") as? String,
      let payload = UserDefaults(suiteName: appGroupIdentifier)?.string(forKey: widgetSnapshotKey),
      let data = payload.data(using: .utf8),
      let persisted = try? JSONDecoder().decode(PersistedWidgetSnapshot.self, from: data)
    else {
      return nil
    }

    return persisted.snapshot
  }
}

struct DotToDustWidgetView: View {
  @Environment(\.widgetFamily) private var family

  let entry: DotToDustEntry

  var body: some View {
    if let snapshot = entry.snapshot, snapshot.kind == "ready" {
      VStack(alignment: .leading, spacing: 10) {
        summary(snapshot)

        if family != .systemSmall {
          widgetGrid(snapshot)
        }
      }
      .padding(14)
      .containerBackground(backgroundColor(snapshot), for: .widget)
    } else {
      Text(entry.snapshot?.cta ?? "Set date of birth")
        .font(.system(size: 14, weight: .medium, design: .serif))
        .foregroundStyle(.primary)
        .containerBackground(Color(.systemBackground), for: .widget)
    }
  }

  private func summary(_ snapshot: WidgetSnapshot) -> some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(snapshot.display?.viewLabel ?? "")
        .font(.system(size: 12, weight: .regular, design: .serif).italic())
        .foregroundStyle(.secondary)

      Text(snapshot.display?.hero ?? "")
        .font(.system(size: 24, weight: .medium, design: .serif))
        .minimumScaleFactor(0.7)
        .lineLimit(1)

      ProgressView(value: snapshot.progress ?? 0)
        .tint(color(snapshot.colors?.accent))

      Text(snapshot.display?.percent ?? "")
        .font(.system(size: 11, weight: .medium, design: .default))
        .foregroundStyle(.secondary)
    }
  }

  private func widgetGrid(_ snapshot: WidgetSnapshot) -> some View {
    GeometryReader { proxy in
      let dots = snapshot.dots ?? []
      let columns = gridColumns(count: dots.count, width: proxy.size.width, height: proxy.size.height)

      LazyVGrid(columns: columns, spacing: 1) {
        ForEach(dots) { dot in
          Circle()
            .fill(dotColor(dot, snapshot: snapshot))
            .overlay {
              if dot.isToday == true && snapshot.bonus != true {
                Circle().stroke(color(snapshot.colors?.ring), lineWidth: 1)
              }
            }
        }
      }
    }
  }

  private func gridColumns(count: Int, width: CGFloat, height: CGFloat) -> [GridItem] {
    guard count > 0, width > 0, height > 0 else { return [] }

    let ratio = max(width / max(height, 1), 1)
    let columnCount = max(1, Int((Double(count) * Double(ratio)).squareRoot()))
    return Array(repeating: GridItem(.flexible(minimum: 2), spacing: 1), count: columnCount)
  }

  private func dotColor(_ dot: WidgetDot, snapshot: WidgetSnapshot) -> Color {
    if dot.kind == "future" {
      return color(snapshot.colors?.future)
    }

    let stages = snapshot.colors?.stages ?? []
    let index = min(max(dot.stage ?? 0, 0), max(stages.count - 1, 0))
    return color(stages.indices.contains(index) ? stages[index] : nil)
  }

  private func backgroundColor(_ snapshot: WidgetSnapshot) -> Color {
    snapshot.colors?.future == nil ? Color(.systemBackground) : Color(.systemBackground)
  }

  private func color(_ hex: String?) -> Color {
    guard let hex else { return Color.primary.opacity(0.18) }
    return Color(hex: hex)
  }
}

struct DotToDustWidget: Widget {
  let kind = "DotToDustWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: DotToDustProvider()) { entry in
      DotToDustWidgetView(entry: entry)
    }
    .configurationDisplayName("Dot to Dust")
    .description("Your life progress at a glance.")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
  }
}

@main
struct DotToDustWidgetBundle: WidgetBundle {
  var body: some Widget {
    DotToDustWidget()
  }
}

extension Color {
  init(hex: String) {
    let scanner = Scanner(string: hex.replacingOccurrences(of: "#", with: ""))
    var value: UInt64 = 0
    scanner.scanHexInt64(&value)

    let red = Double((value >> 16) & 0xff) / 255
    let green = Double((value >> 8) & 0xff) / 255
    let blue = Double(value & 0xff) / 255

    self.init(red: red, green: green, blue: blue)
  }
}
