const pg = require("pg");
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "nextjs",
    password: "lol",
    port: 5432,
});

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');



const test = async () => {
    const { rows }= await pool.query(`SELECT * FROM customers`);

    return rows
}

async function addCustomers() {
    try {
        await Promise.all(
            customers.map(async (customer) => {
                const query = {
                    text: 'INSERT INTO customers(id, name, email, image_url) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                    values: [`${customer.id}`, `${customer.name}`, `${customer.email}`, `${customer.image_url}`]
                }
                const { rows } = await pool.query(query);
                console.log(rows);
            })
        )
    } catch (err) {
        console.error(err);
    }
}

async function addUser() {
    try {
        await Promise.all(
            users.map(async (user) => {
                const query = {
                    text: 'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                    values: [`${user.id}`, `${user.name}`, `${user.email}`, `${user.password}`]
                }
                const { rows } = await pool.query(query);
                console.log(rows);
            })
        )
    } catch (err) {
        console.error(err);
    }
}

async function addInvoice() {
    try {
        await Promise.all(
            invoices.map(async (invoice) => {
                const query = {
                    text: 'INSERT INTO invoices(customer_id, amount, status, date) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                    values: [`${invoice.customer_id}`, `${invoice.amount}`, `${invoice.status}`, `${invoice.date}`]
                }
                const { rows } = await pool.query(query);
                console.log(rows);
            })
        )
    } catch (err) {
        console.error(err);
    }
}

async function addRevenue() {
    try {
        await Promise.all(
            revenue.map(async (item) => {
                const query = {
                    text: 'INSERT INTO revenue(month, revenue) VALUES($1, $2) ON CONFLICT DO NOTHING',
                    values: [`${item.month}`, `${item.revenue}`]
                }
                const { rows } = await pool.query(query);
                console.log(rows);
            })
        )
    } catch (err) {
        console.error(err);
    }
}

console.log(test);
(async () => {
    const test = await addRevenue();
    console.log(customers.length);
})();
