import { formatToLocalTime, calcOffset } from "../timeUtils";

describe("timeUtils", () => {
  describe("formatToLocalTime", () => {
    it("should format a date string to local time with the default format", () => {
      const secs = "1629788400";
      const zone = 3600;
      const formattedTime = formatToLocalTime(secs, zone);
      expect(formattedTime).toEqual("08:00");
    });

    it("should format a date string to local time with a custom format", () => {
      const secs = "1629788400";
      const zone = -14400;
      const format = "h:mm a";
      const formattedTime = formatToLocalTime(secs, zone, format);
      expect(formattedTime).toEqual("3:00 AM");
    });
  });
});

describe("timeUtils", () => {
  describe("calcOffset", () => {
    it("should calculate the UTC offset for a positive time zone", () => {
      const zone = 3600;
      const offset = calcOffset(zone);
      expect(offset).toEqual("+1");
    });

    it("should calculate the UTC offset for a negative time zone", () => {
      const zone = -14400;
      const offset = calcOffset(zone);
      expect(offset).toEqual("-4");
    });

    it("should calculate the UTC offset for a time zone with a decimal value (India)", () => {
      const zone = 19800;
      const offset = calcOffset(zone);
      expect(offset).toEqual("+5:30");
    });
  });
});
