import SwiftUI
import WidgetKit

private let widgetSnapshotKey = "widget-snapshot"

struct PersistedWidgetSnapshot: Decodable {
  let schemaVersion: Int
  let snapshot: WidgetSnapshot
}

struct WidgetSnapshot: Decodable {
  let kind: String
  let dob: String?
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
  let nextViewBoundaryDate: String?
  let nextSafetyRefreshDate: String?
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
  let background: String?
  let text: String?
  let secondaryText: String?
  let progressTrack: String?
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

  init(stage: Int? = nil, isToday: Bool? = nil, kind: String? = nil) {
    self.stage = stage
    self.isToday = isToday
    self.kind = kind
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
    let snapshot = readSnapshot()
    let entry = DotToDustEntry(date: Date(), snapshot: snapshot)
    let next = nextRefreshDate(snapshot) ?? gregorianCalendar.date(byAdding: .day, value: 1, to: Date()) ?? Date()
    completion(Timeline(entries: [entry], policy: .after(next)))
  }

  private func readSnapshot() -> WidgetSnapshot? {
    guard
      let appGroupIdentifier = Bundle.main.object(forInfoDictionaryKey: "AppGroupIdentifier") as? String,
      let payload = UserDefaults(suiteName: appGroupIdentifier)?.string(forKey: widgetSnapshotKey),
      let data = payload.data(using: .utf8),
      let persisted = try? JSONDecoder().decode(PersistedWidgetSnapshot.self, from: data),
      persisted.schemaVersion == 2
    else {
      return nil
    }

    return persisted.snapshot.refreshedForToday()
  }

  private func nextRefreshDate(_ snapshot: WidgetSnapshot?) -> Date? {
    let dates = [
      snapshot?.nextViewBoundaryDate,
      snapshot?.nextSafetyRefreshDate,
    ].compactMap { value in
      value.flatMap(startOfDay)
    }

    return dates.min()
  }

  private func startOfDay(_ value: String) -> Date? {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.dateFormat = "yyyy-MM-dd"

    guard let date = formatter.date(from: value) else { return nil }
    return gregorianCalendar.startOfDay(for: date)
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
      .widgetBackground(backgroundColor(snapshot))
      .widgetURL(URL(string: "dottodust://"))
    } else {
      Text(entry.snapshot?.cta ?? "Set date of birth")
        .font(.system(size: 14, weight: .medium, design: .serif))
        .foregroundStyle(setupTextColor)
        .widgetBackground(setupBackgroundColor)
        .widgetURL(URL(string: "dottodust://"))
    }
  }

  private func summary(_ snapshot: WidgetSnapshot) -> some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(snapshot.display?.viewLabel ?? "")
        .font(.system(size: 12, weight: .regular, design: .serif).italic())
        .foregroundStyle(secondaryTextColor(snapshot))

      Text(snapshot.display?.hero ?? "")
        .font(.system(size: 24, weight: .medium, design: .serif))
        .foregroundStyle(textColor(snapshot))
        .minimumScaleFactor(0.7)
        .lineLimit(1)

      ProgressView(value: snapshot.progress ?? 0)
        .tint(color(snapshot.colors?.accent))
        .background(color(snapshot.colors?.progressTrack))

      Text(snapshot.display?.percent ?? "")
        .font(.system(size: 11, weight: .medium, design: .default))
        .foregroundStyle(secondaryTextColor(snapshot))
    }
  }

  private func widgetGrid(_ snapshot: WidgetSnapshot) -> some View {
    GeometryReader { proxy in
      let dots = snapshot.dots ?? []
      let columns = gridColumns(count: dots.count, width: proxy.size.width, height: proxy.size.height)
      let size = dotSize(count: dots.count, width: proxy.size.width, height: proxy.size.height)

      if size >= 2 {
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
  }

  private func gridColumns(count: Int, width: CGFloat, height: CGFloat) -> [GridItem] {
    guard count > 0, width > 0, height > 0 else { return [] }

    let ratio = max(width / max(height, 1), 1)
    let columnCount = max(1, Int((Double(count) * Double(ratio)).squareRoot()))
    return Array(repeating: GridItem(.flexible(minimum: 2), spacing: 1), count: columnCount)
  }

  private func dotSize(count: Int, width: CGFloat, height: CGFloat) -> CGFloat {
    guard count > 0, width > 0, height > 0 else { return 0 }

    let ratio = max(width / max(height, 1), 1)
    let columns = max(1, Int((Double(count) * Double(ratio)).squareRoot()))
    let rows = Int(ceil(Double(count) / Double(columns)))
    return min(
      (width - CGFloat(columns - 1)) / CGFloat(columns),
      (height - CGFloat(rows - 1)) / CGFloat(rows)
    )
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
    color(snapshot.colors?.background)
  }

  private var setupBackgroundColor: Color {
    Color(hex: "#faf8f5")
  }

  private var setupTextColor: Color {
    Color(hex: "#2b2520")
  }

  private func textColor(_ snapshot: WidgetSnapshot) -> Color {
    color(snapshot.colors?.text)
  }

  private func secondaryTextColor(_ snapshot: WidgetSnapshot) -> Color {
    color(snapshot.colors?.secondaryText)
  }

  private func color(_ hex: String?) -> Color {
    guard let hex else { return Color.primary.opacity(0.18) }
    return Color(hex: hex)
  }
}

private let weeksTotal = 4160
private let monthsTotal = 960
private let yearsTotal = 80
private let numberFormatter: NumberFormatter = {
  let formatter = NumberFormatter()
  formatter.locale = Locale(identifier: "en_US")
  formatter.numberStyle = .decimal
  formatter.maximumFractionDigits = 0
  return formatter
}()
private let gregorianCalendar = Calendar(identifier: .gregorian)

extension WidgetSnapshot {
  func refreshedForToday() -> WidgetSnapshot {
    guard kind == "ready", let dob, let birthDate = Self.civilDate(dob) else {
      return self
    }

    let today = gregorianCalendar.startOfDay(for: Date())
    let currentView = view ?? display?.viewLabel ?? "weeks"
    let currentTotal = Self.total(for: currentView)
    let currentLived = Self.unitsLived(currentView, from: birthDate, to: today)
    let isBonus = Self.unitsLived("weeks", from: birthDate, to: today) >= weeksTotal
    let count = isBonus ? max(Self.unitsLived(currentView, from: birthDate, to: today) - currentTotal, 0) : currentLived
    let currentPercent = isBonus ? 100 : min(Int(round((Double(currentLived) / Double(currentTotal)) * 100)), 100)
    let currentProgress = isBonus ? 1 : min(Double(currentLived) / Double(currentTotal), 1)
    let hero = isBonus
      ? "+\(Self.format(count)) \(currentView) ahead"
      : "\(Self.format(currentLived)) / \(Self.format(currentTotal))"

    return WidgetSnapshot(
      kind: kind,
      dob: dob,
      view: currentView,
      lived: currentLived,
      total: currentTotal,
      percent: currentPercent,
      progress: currentProgress,
      bonus: isBonus,
      display: WidgetDisplay(hero: hero, percent: "\(currentPercent)%", viewLabel: currentView),
      colors: colors,
      dots: Self.buildDots(view: currentView, lived: currentLived, bonus: isBonus),
      cta: cta,
      nextViewBoundaryDate: Self.nextViewBoundaryDate(currentView, dob: birthDate, lived: currentLived),
      nextSafetyRefreshDate: Self.civilString(gregorianCalendar.date(byAdding: .day, value: 1, to: today))
    )
  }

  private static func civilDate(_ value: String) -> Date? {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.date(from: value).map { gregorianCalendar.startOfDay(for: $0) }
  }

  private static func civilString(_ date: Date?) -> String? {
    guard let date else { return nil }
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: date)
  }

  private static func total(for view: String) -> Int {
    switch view {
    case "months": return monthsTotal
    case "years": return yearsTotal
    default: return weeksTotal
    }
  }

  private static func unitsLived(_ view: String, from dob: Date, to today: Date) -> Int {
    let component: Calendar.Component = view == "months" ? .month : view == "years" ? .year : .weekOfYear
    return max(gregorianCalendar.dateComponents([component], from: dob, to: today).value(for: component) ?? 0, 0)
  }

  private static func nextViewBoundaryDate(_ view: String, dob: Date, lived: Int) -> String? {
    let component: Calendar.Component = view == "months" ? .month : view == "years" ? .year : .weekOfYear
    return civilString(gregorianCalendar.date(byAdding: component, value: lived + 1, to: dob))
  }

  private static func buildDots(view: String, lived: Int, bonus: Bool) -> [WidgetDot] {
    (1...total(for: view)).map { index in
      if !bonus && index > lived {
        return WidgetDot(kind: "future")
      }

      return WidgetDot(stage: stageForWeek(toWeekIndex(view, index)), isToday: !bonus && index == lived)
    }
  }

  private static func toWeekIndex(_ view: String, _ index: Int) -> Int {
    switch view {
    case "months": return Int(round((Double(index - 1) / 12) * 52)) + 1
    case "years": return (index - 1) * 52 + 1
    default: return index
    }
  }

  private static func stageForWeek(_ weekIndex: Int) -> Int {
    let age = Int(floor(Double(weekIndex - 1) / 52))
    switch age {
    case ...11: return 0
    case ...22: return 1
    case ...39: return 2
    case ...59: return 3
    default: return 4
    }
  }

  private static func format(_ value: Int) -> String {
    numberFormatter.string(from: NSNumber(value: value)) ?? "\(value)"
  }
}

extension View {
  @ViewBuilder
  func widgetBackground(_ color: Color) -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      self.containerBackground(color, for: .widget)
    } else {
      self.background(color)
    }
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
