 
require("dotenv").config();

const {
  planShoppingQuery
} = require("./src/services/query/queryPlanner");

async function main() {
  const testQueries = [
    "I want to buy a short kurti for women under 1000",
    "I need chocolate ice cream",
    "I want a touchscreen phone under 7000",
    "I need shampoo",
    "I need a pad"
  ];

  for (const query of testQueries) {
    console.log("\nUSER:", query);

    try {
      const plan = await planShoppingQuery(query);
      console.dir(plan, { depth: null });
    } catch (error) {
      console.error(
        "Planner test failed:",
        error.response?.data || error.message
      );
    }
  }
}

main();
