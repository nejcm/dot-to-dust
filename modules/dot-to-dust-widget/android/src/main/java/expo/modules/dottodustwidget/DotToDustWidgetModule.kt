package expo.modules.dottodustwidget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DotToDustWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DotToDustWidget")

    Function("writeSnapshot") { payload: String ->
      val context = appContext.reactContext ?: return@Function
      DotToDustWidgetStorage.write(context, payload)
      DotToDustWidgetProvider.updateAll(context)
    }
  }
}

object DotToDustWidgetStorage {
  private const val PREFERENCES_NAME = "dot-to-dust-widget"
  private const val SNAPSHOT_KEY = "widget-snapshot"

  fun write(context: Context, payload: String) {
    context
      .getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)
      .edit()
      .putString(SNAPSHOT_KEY, payload)
      .apply()
  }

  fun read(context: Context): String? {
    return context
      .getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)
      .getString(SNAPSHOT_KEY, null)
  }
}

fun AppWidgetManager.dotToDustWidgetIds(context: Context): IntArray {
  return getAppWidgetIds(ComponentName(context, DotToDustWidgetProvider::class.java))
}
