import ExpoModulesCore
import WidgetKit

public class DotToDustWidgetModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DotToDustWidget")

    Function("writeSnapshot") { (payload: String) in
      guard
        let appGroupIdentifier = Bundle.main.object(forInfoDictionaryKey: "AppGroupIdentifier") as? String,
        let defaults = UserDefaults(suiteName: appGroupIdentifier)
      else {
        return
      }

      defaults.set(payload, forKey: "widget-snapshot")

      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
