package expo.modules.dottodustwidget

import java.util.Calendar
import java.util.GregorianCalendar
import java.util.TimeZone
import org.junit.Assert.assertEquals
import org.junit.After
import org.junit.Before
import org.junit.Test

class DotToDustWidgetProviderTest {
  private lateinit var originalTimeZone: TimeZone

  @Before
  fun setUp() {
    originalTimeZone = TimeZone.getDefault()
  }

  @After
  fun tearDown() {
    TimeZone.setDefault(originalTimeZone)
  }

  @Test
  fun refreshesSharedWeekLifeMathCases() {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

    listOf(
      Triple("2000-01-01", civilDate(2000, 1, 1), "0 / 4,160"),
      Triple("2000-01-01", civilDate(2000, 1, 7), "0 / 4,160"),
      Triple("2000-01-01", civilDate(2000, 1, 8), "1 / 4,160"),
      Triple("2001-01-01", civilDate(2002, 1, 1), "52 / 4,160"),
      Triple("1990-06-15", civilDate(2020, 6, 15), "1,565 / 4,160"),
    ).forEach { (dob, today, expectedHero) ->
      val snapshot = readySnapshot(dob = dob, view = "weeks").refreshedFor(today)

      assertEquals(expectedHero, snapshot.hero)
    }
  }

  @Test
  fun refreshesWeeksAcrossDstSpringForwardBoundary() {
    TimeZone.setDefault(TimeZone.getTimeZone("America/New_York"))

    val snapshot = readySnapshot(dob = "2020-03-08", view = "weeks")
      .refreshedFor(civilDate(2020, 3, 15))

    assertEquals("1 / 4,160", snapshot.hero)
    assertEquals(4160, snapshot.dots?.length())
    assertEquals(true, snapshot.dots?.getJSONObject(0)?.optBoolean("isToday"))
  }

  @Test
  fun refreshesLeapYearDobAgainstSharedLifeMathCases() {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

    val weeks = readySnapshot(dob = "2000-02-29", view = "weeks")
      .refreshedFor(civilDate(2023, 2, 28))
    val years = readySnapshot(dob = "2000-02-29", view = "years")
      .refreshedFor(civilDate(2023, 2, 28))

    assertEquals("1,200 / 4,160", weeks.hero)
    assertEquals("22 / 80", years.hero)
  }

  private fun readySnapshot(dob: String, view: String): AndroidWidgetSnapshot {
    return AndroidWidgetSnapshot(
      kind = "ready",
      dob = dob,
      viewLabel = view,
    )
  }

  private fun civilDate(year: Int, month: Int, day: Int): Calendar {
    return GregorianCalendar(TimeZone.getDefault()).apply {
      clear()
      set(year, month - 1, day, 0, 0, 0)
      set(Calendar.MILLISECOND, 0)
    }
  }
}
