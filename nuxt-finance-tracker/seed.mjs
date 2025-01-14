import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: { persistSession: false },
  }
);
const categories = ["Food", "Housing", "Car", "Entertainment"];

async function seedTransactions() {
  // Delete existing data
  const { error: deleteError } = await supabase
    .from("transactions")
    .delete()
    .gte("id", 0); // id column이 more than 0이면 전부 delete해라. 즉, 모든 row 삭제

  if (deleteError) {
    console.error("Error deleting existing data: ", deleteError);
    return;
  }

  let transactions = [];

  // 날짜 설정 current year & last year
  for (
    let year = new Date().getFullYear();
    year > new Date().getFullYear() - 2;
    year--
  ) {
    for (let i = 0; i < 10; i++) {
      const date = new Date(
        year,
        faker.number.int({ min: 0, max: 11 }), // month
        faker.number.int({ min: 1, max: 28 }) // day
      );

      let type, category;
      const typeBias = Math.random();

      if (typeBias < 0.85) {
        type = "Expense";
        category = faker.helpers.arrayElement(categories); // Category only for 'Expense'
      } else if (typeBias < 0.95) {
        type = "Income";
      } else {
        type = faker.helpers.arrayElement(["Saving", "Investment"]);
      }

      let amount;
      switch (type) {
        case "Income":
          amount = faker.number.int({ min: 2000000, max: 5000000 });
          break;
        case "Expense":
          amount = faker.number.int({ min: 100000, max: 1000000 });
          break;
        case "Saving":
        case "Investment":
          amount = faker.number.int({ min: 5000000, max: 10000000 });
          break;
        default:
          amount = 0;
      }

      transactions.push({
        created_at: date,
        amount,
        type,
        description: faker.lorem.sentence(),
        category: type === "Expense" ? category : null,
      });
    }
  }

  const { error: insertError } = await supabase
    .from("transactions")
    .upsert(transactions); // update + insert

  if (insertError) {
    console.error("Error inserting data:", insertError);
  } else {
    console.log("Data inserted successfly");
  }
}

seedTransactions().catch(console.error);
