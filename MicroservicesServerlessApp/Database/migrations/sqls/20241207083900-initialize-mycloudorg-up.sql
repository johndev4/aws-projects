-- Create schema for custom org
CREATE SCHEMA IF NOT EXISTS mycloudorg;

-- Create functions first
CREATE OR REPLACE FUNCTION mycloudorg.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION mycloudorg.log_order_history()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO mycloudorg.order_history (order_id, status)
        VALUES (NEW.order_id, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION mycloudorg.calculate_total_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price = NEW.quantity * NEW.unit_price;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create tables
CREATE TABLE IF NOT EXISTS mycloudorg.users_info (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE CHECK (length(username) >= 3),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone_number VARCHAR(20),
    date_of_birth DATE CHECK (date_of_birth <= CURRENT_DATE),
    street VARCHAR(100) NULL,
    barangay VARCHAR(50) NULL,
    city VARCHAR(50) NULL,
    municipality VARCHAR(50) NULL,
    country VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mycloudorg.coffee_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mycloudorg.coffees (
    coffee_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES mycloudorg.coffee_categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mycloudorg.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    coffee_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES mycloudorg.users_info(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES mycloudorg.coffees(coffee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mycloudorg.order_history (
    history_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES mycloudorg.orders(order_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mycloudorg.reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    coffee_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES mycloudorg.users_info(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES mycloudorg.coffees(coffee_id) ON DELETE CASCADE,
    UNIQUE(user_id, coffee_id)  -- One review per user per coffee
);

CREATE TABLE IF NOT EXISTS mycloudorg.payment_details (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES mycloudorg.orders(order_id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_users_email ON mycloudorg.users_info(email);
CREATE INDEX idx_users_username ON mycloudorg.users_info(username);
CREATE INDEX idx_orders_user_id ON mycloudorg.orders(user_id);
CREATE INDEX idx_orders_status ON mycloudorg.orders(status);
CREATE INDEX idx_orders_order_date ON mycloudorg.orders(order_date);
CREATE INDEX idx_coffees_category_id ON mycloudorg.coffees(category_id);
CREATE INDEX idx_reviews_coffee_id ON mycloudorg.reviews(coffee_id);
CREATE INDEX idx_payment_details_status ON mycloudorg.payment_details(payment_status);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON mycloudorg.users_info
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.update_timestamp();

CREATE TRIGGER update_coffee_categories_timestamp
    BEFORE UPDATE ON mycloudorg.coffee_categories
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.update_timestamp();

CREATE TRIGGER update_coffees_timestamp
    BEFORE UPDATE ON mycloudorg.coffees
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.update_timestamp();

CREATE TRIGGER update_orders_timestamp
    BEFORE UPDATE ON mycloudorg.orders
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.update_timestamp();

CREATE TRIGGER update_reviews_timestamp
    BEFORE UPDATE ON mycloudorg.reviews
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.update_timestamp();

CREATE TRIGGER update_payment_details_timestamp
    BEFORE UPDATE ON mycloudorg.payment_details
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.update_timestamp();

-- Create a trigger to automatically add order history when order status changes
CREATE TRIGGER track_order_history
    AFTER INSERT OR UPDATE ON mycloudorg.orders
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.log_order_history();

-- Create a trigger to update total_price based on quantity and unit_price
CREATE TRIGGER update_total_price
    BEFORE INSERT OR UPDATE ON mycloudorg.orders
    FOR EACH ROW
    EXECUTE FUNCTION mycloudorg.calculate_total_price();
