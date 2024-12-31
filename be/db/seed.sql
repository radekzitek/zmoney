-- Insert Categories
INSERT INTO categories (name, description) VALUES
    ('Groceries', 'Food and household items'),
    ('Transport', 'Public transport and fuel'),
    ('Utilities', 'Bills for utilities'),
    ('Entertainment', 'Leisure activities'),
    ('Income', 'Salary and other income'),
    ('Rent', 'Housing payments'),
    ('Shopping', 'Retail purchases');

-- Insert Transaction Types
INSERT INTO transaction_types (name, direction, description) VALUES
    ('Card Payment', 'debit', 'Payment using debit/credit card'),
    ('Direct Debit', 'debit', 'Automated regular payment'),
    ('Standing Order', 'debit', 'Regular automated payment'),
    ('Bank Transfer', 'debit', 'One-off bank transfer'),
    ('Salary', 'credit', 'Income from employment'),
    ('Interest', 'credit', 'Interest earned'),
    ('Refund', 'credit', 'Refund from previous transaction');

-- Insert some example counterparties
INSERT INTO counterparties (name, reference) VALUES
    ('Tesco', 'TESCO STORES 2044'),
    ('Transport for London', 'TFL TRAVEL'),
    ('British Gas', 'BRITISH GAS TRADING'),
    ('Netflix', 'NETFLIX.COM'),
    ('Employer Ltd', 'SALARY'); 