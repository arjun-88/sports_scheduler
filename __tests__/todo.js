const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("for uploading", async () => {
  expect(true).toBe(true);
});
});