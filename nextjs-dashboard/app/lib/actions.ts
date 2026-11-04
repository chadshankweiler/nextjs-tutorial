'use server'

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const pg = require("pg");
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "nextjs",
    password: "lol",
    port: 5432,
});


const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  date: z.string(),
  status: z.enum(['pending', 'paid']),
})

const CustomersFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image_url: z.string(),
})


const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true })
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const {
      customerId, 
      amount,
      status
  } = CreateInvoice.parse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
      await pool.query(' INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)', [customerId, amountInCents, status, date])

  } catch (error){
      return { message: "Database Error: Can't Create Invoice" };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}




export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;

  try {
 
      await pool.query(`
        UPDATE invoices
        SET customer_id = $1, amount = $2, status = $3
        WHERE id = $4
      `, [customerId, amountInCents, status, id]);

  } catch (error) {
    return { message: "Database Error: Can't Create Invoice" };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    //throw new Error("something");
    try {
        await pool.query(`DELETE FROM invoices WHERE id = $1`, [id])
    } catch (error) {
      return { message: "Database Error: Can't Create Invoice" };
    }
    revalidatePath('/dashboard/invoices');
}

const CreateCustomer = CustomersFormSchema.omit({ id: true, image_url: true });

export async function createCustomer(formData: FormData) {
  const { name, email } = CreateCustomer.parse({
      name: formData.get('name'),
      email: formData.get('email'),
  })

  try {
      await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2)', [name, email])

  } catch (error){
      return { message: "Database Error: Can't Create Customer" };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

}
