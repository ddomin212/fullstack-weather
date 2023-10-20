import { createChartData, setXYValues } from "../chartUtils";
import { describe, expect, it } from "@jest/globals";

describe("chartUtils", () => {
  describe("createChartData", () => {
    it("should create chart data with correct labels and data", () => {
      const xValues = ["Jan", "Feb", "Mar", "Apr", "May"];
      const yValues = [10, 20, 30, 40, 50];
      const selectedOption = "Sales";
      const chartData = createChartData(xValues, yValues, selectedOption);
      expect(chartData.labels).toEqual(xValues);
      expect(chartData.datasets[0].data).toEqual(yValues);
    });
  });

  describe("setXYValues", () => {
    it("should set x and y values correctly", () => {
      const items = [
        { title: "Item 1", Sales: 10, Revenue: 100 },
        { title: "Item 2", Sales: 20, Revenue: 200 },
        { title: "Item 3", Sales: 30, Revenue: 300 },
      ];
      const selectedOption = "Sales";
      const setXValues = jest.fn();
      const setYValues = jest.fn();
      setXYValues({ items, selectedOption, setXValues, setYValues });
      expect(setXValues).toHaveBeenCalledWith(["Item 1", "Item 2", "Item 3"]);
      expect(setYValues).toHaveBeenCalledWith([10, 20, 30]);
    });
  });
});
