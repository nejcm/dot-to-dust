package expo.modules.dottodustwidget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Bundle
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt

class DotToDustWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    appWidgetIds.forEach { id ->
      updateWidget(context, appWidgetManager, id)
    }
  }

  override fun onAppWidgetOptionsChanged(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int,
    newOptions: Bundle,
  ) {
    updateWidget(context, appWidgetManager, appWidgetId)
  }

  companion object {
    fun updateAll(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      manager.dotToDustWidgetIds(context).forEach { id ->
        updateWidget(context, manager, id)
      }
    }

    private fun updateWidget(
      context: Context,
      manager: AppWidgetManager,
      widgetId: Int,
    ) {
      val snapshot = DotToDustWidgetStorage.read(context)?.let(::parseSnapshot)
      val views = RemoteViews(context.packageName, R.layout.dot_to_dust_widget)
      val options = manager.getAppWidgetOptions(widgetId)
      val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110)
      val minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110)

      if (snapshot == null || snapshot.kind == "setup") {
        views.setTextViewText(R.id.widget_view_label, "")
        views.setTextViewText(R.id.widget_hero, snapshot?.cta ?: "Set date of birth")
        views.setTextViewText(R.id.widget_percent, "")
        views.setProgressBar(R.id.widget_progress, 100, 0, false)
        views.setImageViewBitmap(R.id.widget_grid, Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888))
      } else {
        views.setTextViewText(R.id.widget_view_label, snapshot.viewLabel)
        views.setTextViewText(R.id.widget_hero, snapshot.hero)
        views.setTextViewText(R.id.widget_percent, snapshot.percent)
        views.setProgressBar(R.id.widget_progress, 100, (snapshot.progress * 100).toInt(), false)

        val grid = drawGrid(snapshot, minWidth, minHeight)
        views.setImageViewBitmap(R.id.widget_grid, grid)
      }

      manager.updateAppWidget(widgetId, views)
    }

    private fun parseSnapshot(payload: String): AndroidWidgetSnapshot? {
      return runCatching {
        val snapshot = JSONObject(payload).getJSONObject("snapshot")
        if (snapshot.getString("kind") == "setup") {
          return@runCatching AndroidWidgetSnapshot(kind = "setup", cta = snapshot.optString("cta"))
        }

        val display = snapshot.getJSONObject("display")
        val colors = snapshot.getJSONObject("colors")
        AndroidWidgetSnapshot(
          kind = "ready",
          viewLabel = display.getString("viewLabel"),
          hero = display.getString("hero"),
          percent = display.getString("percent"),
          progress = snapshot.getDouble("progress"),
          bonus = snapshot.optBoolean("bonus"),
          dots = snapshot.getJSONArray("dots"),
          stages = colors.getJSONArray("stages"),
          future = colors.getString("future"),
          ring = colors.getString("ring"),
        )
      }.getOrNull()
    }

    private fun drawGrid(snapshot: AndroidWidgetSnapshot, minWidthDp: Int, minHeightDp: Int): Bitmap {
      val width = max(minWidthDp * 2, 1)
      val height = max((minHeightDp - 76) * 2, 1)
      val dots = snapshot.dots ?: return Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
      val count = dots.length()
      if (count == 0) return Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)

      val ratio = max(width.toDouble() / max(height, 1), 1.0)
      val cols = max(sqrt(count * ratio).toInt(), 1)
      val rows = ceil(count.toDouble() / cols).toInt()
      val gap = 1f
      val dotSize = min(
        (width.toFloat() - gap * (cols - 1)) / cols,
        (height.toFloat() - gap * (rows - 1)) / rows,
      )

      val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
      if (dotSize < 2f) return bitmap

      val canvas = Canvas(bitmap)
      val paint = Paint(Paint.ANTI_ALIAS_FLAG)
      val ringPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = parseColor(snapshot.ring)
        style = Paint.Style.STROKE
        strokeWidth = 1.5f
      }

      for (index in 0 until count) {
        val dot = dots.getJSONObject(index)
        val col = index % cols
        val row = index / cols
        val left = col * (dotSize + gap)
        val top = row * (dotSize + gap)
        val radius = dotSize / 2

        paint.color = dotColor(dot, snapshot)
        canvas.drawCircle(left + radius, top + radius, radius, paint)

        if (dot.optBoolean("isToday") && !snapshot.bonus) {
          canvas.drawCircle(left + radius, top + radius, radius, ringPaint)
        }
      }

      return bitmap
    }

    private fun dotColor(dot: JSONObject, snapshot: AndroidWidgetSnapshot): Int {
      if (dot.optString("kind") == "future") return parseColor(snapshot.future)
      val stages = snapshot.stages ?: return Color.LTGRAY
      val stage = min(max(dot.optInt("stage", 0), 0), stages.length() - 1)
      return parseColor(stages.getString(stage))
    }

    private fun parseColor(hex: String?): Int {
      return runCatching { Color.parseColor(hex ?: "#d8d4cf") }.getOrDefault(Color.LTGRAY)
    }
  }
}

data class AndroidWidgetSnapshot(
  val kind: String,
  val viewLabel: String = "",
  val hero: String = "",
  val percent: String = "",
  val progress: Double = 0.0,
  val bonus: Boolean = false,
  val dots: JSONArray? = null,
  val stages: JSONArray? = null,
  val future: String? = null,
  val ring: String? = null,
  val cta: String? = null,
)
