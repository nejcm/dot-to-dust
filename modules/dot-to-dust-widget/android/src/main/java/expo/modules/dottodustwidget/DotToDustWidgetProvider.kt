package expo.modules.dottodustwidget

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject
import java.text.NumberFormat
import java.util.Calendar
import java.util.GregorianCalendar
import java.util.Locale
import java.util.TimeZone
import kotlin.math.ceil
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt

class DotToDustWidgetProvider : AppWidgetProvider() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == ACTION_REFRESH) {
      updateAll(context)
      return
    }

    super.onReceive(context, intent)
  }

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
    private const val ACTION_REFRESH = "expo.modules.dottodustwidget.REFRESH"
    private const val MIN_DOT_SIZE_PX = 2f

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
      val snapshot = DotToDustWidgetStorage.read(context)?.let(::parseSnapshot)?.refreshedForToday()
      val views = RemoteViews(context.packageName, R.layout.dot_to_dust_widget)
      val options = manager.getAppWidgetOptions(widgetId)
      val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110)
      val minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110)

      views.setOnClickPendingIntent(R.id.widget_root, launchPendingIntent(context))

      if (snapshot == null || snapshot.kind == "setup") {
        applyTheme(views, snapshot)
        views.setTextViewText(R.id.widget_view_label, "")
        views.setTextViewText(R.id.widget_hero, snapshot?.cta ?: "Set date of birth")
        views.setTextViewText(R.id.widget_percent, "")
        views.setProgressBar(R.id.widget_progress, 100, 0, false)
        views.setImageViewBitmap(R.id.widget_grid, Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888))
        views.setViewVisibility(R.id.widget_grid, View.GONE)
      } else {
        applyTheme(views, snapshot)
        views.setTextViewText(R.id.widget_view_label, snapshot.viewLabel)
        views.setTextViewText(R.id.widget_hero, snapshot.hero)
        views.setTextViewText(R.id.widget_percent, snapshot.percent)
        views.setProgressBar(R.id.widget_progress, 100, (snapshot.progress * 100).toInt(), false)

        val grid = drawGrid(snapshot, minWidth, minHeight, context.resources.displayMetrics.density)
        if (grid == null) {
          views.setViewVisibility(R.id.widget_grid, View.GONE)
        } else {
          views.setImageViewBitmap(R.id.widget_grid, grid)
          views.setViewVisibility(R.id.widget_grid, View.VISIBLE)
        }
      }

      manager.updateAppWidget(widgetId, views)
      scheduleNextRefresh(context, snapshot)
    }

    private fun parseSnapshot(payload: String): AndroidWidgetSnapshot? {
      return runCatching {
        val persisted = JSONObject(payload)
        if (persisted.optInt("schemaVersion") != 3) return@runCatching null

        val snapshot = persisted.getJSONObject("snapshot")
        if (snapshot.getString("kind") == "setup") {
          return@runCatching AndroidWidgetSnapshot(
            kind = "setup",
            cta = snapshot.optString("cta"),
            nextSafetyRefreshDate = snapshot.optString("nextSafetyRefreshDate", null),
          )
        }

        val display = snapshot.getJSONObject("display")
        val colors = snapshot.getJSONObject("colors")
        AndroidWidgetSnapshot(
          kind = "ready",
          dob = snapshot.optString("dob", null),
          viewLabel = display.getString("viewLabel"),
          hero = display.getString("hero"),
          percent = display.getString("percent"),
          progress = snapshot.getDouble("progress"),
          bonus = snapshot.optBoolean("bonus"),
          stages = colors.getJSONArray("stages"),
          future = colors.getString("future"),
          ring = colors.getString("ring"),
          background = colors.optString("background", "#faf8f5"),
          text = colors.optString("text", "#2b2520"),
          secondaryText = colors.optString("secondaryText", "#80766f"),
          nextViewBoundaryDate = snapshot.optString("nextViewBoundaryDate", null),
          nextSafetyRefreshDate = snapshot.optString("nextSafetyRefreshDate", null),
        )
      }.getOrNull()
    }

    private fun drawGrid(
      snapshot: AndroidWidgetSnapshot,
      minWidthDp: Int,
      minHeightDp: Int,
      density: Float,
    ): Bitmap? {
      val width = max((minWidthDp * density).toInt(), 1)
      val height = max(((minHeightDp - 76) * density).toInt(), 1)
      val dots = snapshot.dots ?: return null
      val count = dots.length()
      if (count == 0) return null

      val ratio = max(width.toDouble() / max(height, 1), 1.0)
      val cols = max(sqrt(count * ratio).toInt(), 1)
      val rows = ceil(count.toDouble() / cols).toInt()
      val gap = 1f
      val dotSize = min(
        (width.toFloat() - gap * (cols - 1)) / cols,
        (height.toFloat() - gap * (rows - 1)) / rows,
      )

      if (dotSize < MIN_DOT_SIZE_PX) return null

      val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

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

    private fun applyTheme(views: RemoteViews, snapshot: AndroidWidgetSnapshot?) {
      val background = parseColor(snapshot?.background ?: "#faf8f5")
      val text = parseColor(snapshot?.text ?: "#2b2520")
      val secondaryText = parseColor(snapshot?.secondaryText ?: "#80766f")

      views.setInt(R.id.widget_root, "setBackgroundColor", background)
      views.setTextColor(R.id.widget_view_label, secondaryText)
      views.setTextColor(R.id.widget_hero, text)
      views.setTextColor(R.id.widget_percent, secondaryText)
    }

    private fun launchPendingIntent(context: Context): PendingIntent? {
      val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        ?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)

      return intent?.let {
        PendingIntent.getActivity(context, 0, it, pendingIntentFlags())
      }
    }

    private fun scheduleNextRefresh(context: Context, snapshot: AndroidWidgetSnapshot?) {
      val triggerAt = snapshot?.nextRefreshMillis() ?: tomorrowStartMillis()
      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
      val intent = Intent(context, DotToDustWidgetProvider::class.java).setAction(ACTION_REFRESH)
      val pendingIntent = PendingIntent.getBroadcast(context, 0, intent, pendingIntentFlags())

      alarmManager.cancel(pendingIntent)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        alarmManager.setAndAllowWhileIdle(AlarmManager.RTC, triggerAt, pendingIntent)
      } else {
        alarmManager.set(AlarmManager.RTC, triggerAt, pendingIntent)
      }
    }

    private fun pendingIntentFlags(): Int {
      return PendingIntent.FLAG_UPDATE_CURRENT or
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
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
  val dob: String? = null,
  val viewLabel: String = "",
  val hero: String = "",
  val percent: String = "",
  val progress: Double = 0.0,
  val bonus: Boolean = false,
  val dots: JSONArray? = null,
  val stages: JSONArray? = null,
  val future: String? = null,
  val ring: String? = null,
  val background: String? = null,
  val text: String? = null,
  val secondaryText: String? = null,
  val nextViewBoundaryDate: String? = null,
  val nextSafetyRefreshDate: String? = null,
  val cta: String? = null,
) {
  fun nextRefreshMillis(): Long {
    return listOfNotNull(
      nextViewBoundaryDate?.let(::startOfDayMillis),
      nextSafetyRefreshDate?.let(::startOfDayMillis),
    ).minOrNull() ?: tomorrowStartMillis()
  }
}

internal fun AndroidWidgetSnapshot.refreshedFor(today: Calendar): AndroidWidgetSnapshot {
  if (kind != "ready" || dob == null) return this

  val birthDate = parseCivilDate(dob) ?: return this
  val view = viewLabel
  val total = totalForView(view)
  val lived = unitsLived(view, birthDate, today)
  val bonus = weeksLived(birthDate, today) >= WEEKS_TOTAL
  val count = if (bonus) max(unitsLived(view, birthDate, today) - total, 0) else lived
  val percent = if (bonus) 100 else min(Math.round((lived.toDouble() / total) * 100).toInt(), 100)
  val progress = if (bonus) 1.0 else min(lived.toDouble() / total, 1.0)

  val tomorrow = (today.clone() as Calendar).apply {
    add(Calendar.DATE, 1)
  }

  return copy(
    hero = if (bonus) "+${NUMBER_FORMAT.format(count)} $view ahead" else "${NUMBER_FORMAT.format(lived)} / ${NUMBER_FORMAT.format(total)}",
    percent = "$percent%",
    progress = progress,
    bonus = bonus,
    dots = buildDots(view, lived, bonus),
    nextViewBoundaryDate = nextViewBoundaryDate(view, birthDate, lived),
    nextSafetyRefreshDate = formatCivilDate(tomorrow),
  )
}

private fun AndroidWidgetSnapshot.refreshedForToday(): AndroidWidgetSnapshot {
  return refreshedFor(todayCalendar())
}

private const val WEEKS_TOTAL = 4160
private const val MONTHS_TOTAL = 960
private const val YEARS_TOTAL = 80
private val NUMBER_FORMAT: NumberFormat = NumberFormat.getIntegerInstance(Locale.US)

private fun totalForView(view: String): Int {
  return when (view) {
    "months" -> MONTHS_TOTAL
    "years" -> YEARS_TOTAL
    else -> WEEKS_TOTAL
  }
}

private fun unitsLived(view: String, dob: Calendar, today: Calendar): Int {
  val units = when (view) {
    "months" -> monthsBetween(dob, today)
    "years" -> yearsBetween(dob, today)
    else -> weeksBetween(dob, today)
  }

  return max(units, 0)
}

private fun weeksLived(dob: Calendar, today: Calendar): Int {
  return max(weeksBetween(dob, today), 0)
}

private fun nextViewBoundaryDate(view: String, dob: Calendar, lived: Int): String {
  val next = lived + 1
  val date = dob.clone() as Calendar
  when (view) {
    "months" -> date.add(Calendar.MONTH, next)
    "years" -> date.add(Calendar.YEAR, next)
    else -> date.add(Calendar.DATE, next * 7)
  }

  return formatCivilDate(date)
}

private fun buildDots(view: String, lived: Int, bonus: Boolean): JSONArray {
  val total = totalForView(view)
  val dots = JSONArray()

  for (index in 1..total) {
    if (!bonus && index > lived) {
      dots.put(JSONObject().put("kind", "future"))
      continue
    }

    dots.put(
      JSONObject()
        .put("stage", stageForWeek(toWeekIndex(view, index)))
        .put("isToday", !bonus && index == lived),
    )
  }

  return dots
}

private fun toWeekIndex(view: String, index: Int): Int {
  return when (view) {
    "months" -> Math.round((((index - 1).toDouble() / 12) * 52)).toInt() + 1
    "years" -> (index - 1) * 52 + 1
    else -> index
  }
}

private fun stageForWeek(weekIndex: Int): Int {
  val age = floor((weekIndex - 1).toDouble() / 52).toInt()
  return when (age) {
    in Int.MIN_VALUE..11 -> 0
    in 12..22 -> 1
    in 23..39 -> 2
    in 40..59 -> 3
    else -> 4
  }
}

private fun todayCalendar(): Calendar {
  val now = GregorianCalendar(TimeZone.getDefault())
  return civilCalendar(
    now.get(Calendar.YEAR),
    now.get(Calendar.MONTH) + 1,
    now.get(Calendar.DAY_OF_MONTH),
  )
}

private fun parseCivilDate(value: String): Calendar? {
  val parts = value.split("-")
  if (parts.size != 3) return null

  return runCatching {
    civilCalendar(parts[0].toInt(), parts[1].toInt(), parts[2].toInt())
  }.getOrNull()
}

private fun civilCalendar(year: Int, month: Int, day: Int): Calendar {
  return GregorianCalendar(TimeZone.getDefault()).apply {
    clear()
    set(year, month - 1, day, 0, 0, 0)
    set(Calendar.MILLISECOND, 0)
  }
}

private fun weeksBetween(start: Calendar, end: Calendar): Int {
  return daysBetween(start, end) / 7
}

private fun daysBetween(start: Calendar, end: Calendar): Int {
  return civilDayNumber(end) - civilDayNumber(start)
}

private fun civilDayNumber(date: Calendar): Int {
  val year = date.get(Calendar.YEAR)
  val month = date.get(Calendar.MONTH) + 1
  val day = date.get(Calendar.DAY_OF_MONTH)
  val shiftedMonth = (month + 9) % 12
  val shiftedYear = year - shiftedMonth / 10
  return 365 * shiftedYear +
    shiftedYear / 4 -
    shiftedYear / 100 +
    shiftedYear / 400 +
    (shiftedMonth * 306 + 5) / 10 +
    day - 1
}

private fun monthsBetween(start: Calendar, end: Calendar): Int {
  var months = (end.get(Calendar.YEAR) - start.get(Calendar.YEAR)) * 12 +
    (end.get(Calendar.MONTH) - start.get(Calendar.MONTH))

  if (end.get(Calendar.DAY_OF_MONTH) < start.get(Calendar.DAY_OF_MONTH)) {
    months -= 1
  }

  return months
}

private fun yearsBetween(start: Calendar, end: Calendar): Int {
  var years = end.get(Calendar.YEAR) - start.get(Calendar.YEAR)
  val beforeBirthday = end.get(Calendar.MONTH) < start.get(Calendar.MONTH) ||
    (end.get(Calendar.MONTH) == start.get(Calendar.MONTH) &&
      end.get(Calendar.DAY_OF_MONTH) < start.get(Calendar.DAY_OF_MONTH))

  if (beforeBirthday) years -= 1
  return years
}

private fun formatCivilDate(date: Calendar): String {
  val year = date.get(Calendar.YEAR).toString().padStart(4, '0')
  val month = (date.get(Calendar.MONTH) + 1).toString().padStart(2, '0')
  val day = date.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')
  return "$year-$month-$day"
}

private fun tomorrowStartMillis(): Long {
  return todayCalendar().apply {
    add(Calendar.DATE, 1)
  }.timeInMillis
}

private fun startOfDayMillis(value: String): Long? {
  return parseCivilDate(value)?.timeInMillis
}
