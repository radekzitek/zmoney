-- Clear existing data
TRUNCATE counterparties, categories, transaction_types, transactions CASCADE;

-- Reset sequences
ALTER SEQUENCE counterparties_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE transaction_types_id_seq RESTART WITH 1;
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Groceries', 'Food and household items'),
('Utilities', 'Electric, water, gas bills'),
('Transportation', 'Public transport and fuel'),
('Entertainment', 'Movies, games, and recreation'),
('Dining Out', 'Restaurants and cafes'),
('Salary', 'Regular employment income'),
('Rent', 'Housing expenses'),
('Healthcare', 'Medical expenses and insurance'),
('Shopping', 'Clothing and general merchandise'),
('Education', 'Books, courses, and training');

-- Insert transaction types
INSERT INTO transaction_types (name, direction, description) VALUES
('Regular Income', 'credit', 'Regular salary and recurring income'),
('Bank Transfer In', 'credit', 'Incoming bank transfers'),
('Cash Deposit', 'credit', 'Cash deposits to account'),
('Regular Expense', 'debit', 'Regular monthly expenses'),
('Direct Debit', 'debit', 'Automated bill payments'),
('Bank Transfer Out', 'debit', 'Outgoing bank transfers'),
('Card Payment', 'debit', 'Debit/credit card transactions'),
('ATM Withdrawal', 'debit', 'Cash withdrawals from ATM');

-- Insert counterparties
INSERT INTO counterparties (name, reference, description) VALUES
('Tesco', 'TESCO-UK', 'Supermarket chain'),
('Amazon UK', 'AMZN-UK', 'Online marketplace'),
('Netflix', 'NFLX-SUB', 'Streaming service'),
('Shell', 'SHELL-UK', 'Gas station'),
('Sainsburys', 'SAINS-UK', 'Grocery store'),
('Tech Solutions Ltd', 'TECHSOL', 'Employer'),
('British Gas', 'BGAS-UK', 'Utility company'),
('TFL', 'TFL-UK', 'Public transportation'),
('Costa Coffee', 'COSTA-UK', 'Coffee shop'),
('Rightmove Lettings', 'RGHT-LET', 'Landlord');

-- Insert transactions
INSERT INTO transactions (
    transaction_date, 
    value_date, 
    amount, 
    description, 
    reference,
    category_id,
    type_id,
    counterparty_id
) VALUES
-- Salary payment
(CURRENT_DATE - INTERVAL '0 days', 
 CURRENT_DATE - INTERVAL '0 days',
 3500.00,
 'Monthly salary payment',
 'SALARY-JAN24',
 (SELECT id FROM categories WHERE name = 'Salary'),
 (SELECT id FROM transaction_types WHERE name = 'Regular Income'),
 (SELECT id FROM counterparties WHERE name = 'Tech Solutions Ltd')),

-- Regular expenses
(CURRENT_DATE - INTERVAL '1 days',
 CURRENT_DATE - INTERVAL '1 days',
 -1200.00,
 'Monthly rent payment',
 'RENT-JAN24',
 (SELECT id FROM categories WHERE name = 'Rent'),
 (SELECT id FROM transaction_types WHERE name = 'Direct Debit'),
 (SELECT id FROM counterparties WHERE name = 'Rightmove Lettings')),

-- Daily transactions
(CURRENT_DATE - INTERVAL '2 days',
 CURRENT_DATE - INTERVAL '2 days',
 -45.50,
 'Weekly grocery shopping',
 'POS-TESCO-2024011',
 (SELECT id FROM categories WHERE name = 'Groceries'),
 (SELECT id FROM transaction_types WHERE name = 'Card Payment'),
 (SELECT id FROM counterparties WHERE name = 'Tesco')),

(CURRENT_DATE - INTERVAL '3 days',
 CURRENT_DATE - INTERVAL '3 days',
 -85.00,
 'Gas and electric bill',
 'DD-BGAS-24011',
 (SELECT id FROM categories WHERE name = 'Utilities'),
 (SELECT id FROM transaction_types WHERE name = 'Direct Debit'),
 (SELECT id FROM counterparties WHERE name = 'British Gas')),

(CURRENT_DATE - INTERVAL '4 days',
 CURRENT_DATE - INTERVAL '4 days',
 -35.00,
 'Monthly travel card',
 'DD-TFL-24011',
 (SELECT id FROM categories WHERE name = 'Transportation'),
 (SELECT id FROM transaction_types WHERE name = 'Direct Debit'),
 (SELECT id FROM counterparties WHERE name = 'TFL')),

(CURRENT_DATE - INTERVAL '5 days',
 CURRENT_DATE - INTERVAL '5 days',
 -11.99,
 'Netflix monthly subscription',
 'DD-NFLX-24011',
 (SELECT id FROM categories WHERE name = 'Entertainment'),
 (SELECT id FROM transaction_types WHERE name = 'Direct Debit'),
 (SELECT id FROM counterparties WHERE name = 'Netflix'));

-- Add some transactions from previous month with different value dates
INSERT INTO transactions (
    transaction_date,
    value_date,
    amount,
    description,
    reference,
    category_id,
    type_id,
    counterparty_id
) VALUES
(CURRENT_DATE - INTERVAL '30 days',
 CURRENT_DATE - INTERVAL '28 days',
 3500.00,
 'Monthly salary payment',
 'SALARY-DEC23',
 (SELECT id FROM categories WHERE name = 'Salary'),
 (SELECT id FROM transaction_types WHERE name = 'Regular Income'),
 (SELECT id FROM counterparties WHERE name = 'Tech Solutions Ltd')),

(CURRENT_DATE - INTERVAL '32 days',
 CURRENT_DATE - INTERVAL '32 days',
 -1200.00,
 'Monthly rent payment',
 'RENT-DEC23',
 (SELECT id FROM categories WHERE name = 'Rent'),
 (SELECT id FROM transaction_types WHERE name = 'Direct Debit'),
 (SELECT id FROM counterparties WHERE name = 'Rightmove Lettings')); 