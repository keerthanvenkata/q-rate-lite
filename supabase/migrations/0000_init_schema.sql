
CREATE TABLE audit_logs (
	id SERIAL NOT NULL, 
	actor VARCHAR NOT NULL, 
	action VARCHAR NOT NULL, 
	target_cafe_id INTEGER, 
	details TEXT, 
	created_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id)
)

;
CREATE INDEX ix_audit_logs_target_cafe_id ON audit_logs (target_cafe_id);
CREATE INDEX ix_audit_logs_id ON audit_logs (id);

CREATE TABLE cafes (
	id SERIAL NOT NULL, 
	slug VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	hashed_password VARCHAR NOT NULL, 
	google_maps_link VARCHAR, 
	reward_text VARCHAR, 
	subscription_status VARCHAR DEFAULT 'trial' NOT NULL, 
	subscription_plan VARCHAR, 
	razorpay_customer_id VARCHAR, 
	plan_expiry TIMESTAMP WITH TIME ZONE, 
	marketing_credits INTEGER DEFAULT '0' NOT NULL, 
	PRIMARY KEY (id)
)

;
CREATE UNIQUE INDEX ix_cafes_slug ON cafes (slug);
CREATE INDEX ix_cafes_id ON cafes (id);

CREATE TABLE contact_messages (
	id SERIAL NOT NULL, 
	name VARCHAR NOT NULL, 
	email VARCHAR NOT NULL, 
	company VARCHAR, 
	phone VARCHAR, 
	message TEXT NOT NULL, 
	status VARCHAR DEFAULT 'unread' NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id)
)

;
CREATE INDEX ix_contact_messages_id ON contact_messages (id);

CREATE TABLE coupons (
	id SERIAL NOT NULL, 
	cafe_id INTEGER NOT NULL, 
	code VARCHAR NOT NULL, 
	customer_phone VARCHAR NOT NULL, 
	status VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE, 
	redeemed_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cafe_id) REFERENCES cafes (id)
)

;
CREATE INDEX ix_coupons_cafe_id ON coupons (cafe_id);
CREATE UNIQUE INDEX ix_coupons_code ON coupons (code);
CREATE INDEX ix_coupons_id ON coupons (id);
CREATE INDEX ix_coupons_customer_phone ON coupons (customer_phone);

CREATE TABLE feedbacks (
	id SERIAL NOT NULL, 
	cafe_id INTEGER NOT NULL, 
	customer_phone VARCHAR NOT NULL, 
	rating INTEGER NOT NULL, 
	comment TEXT, 
	marketing_opt_in BOOLEAN DEFAULT '1' NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cafe_id) REFERENCES cafes (id)
)

;
CREATE INDEX ix_feedbacks_cafe_id ON feedbacks (cafe_id);
CREATE INDEX ix_feedbacks_id ON feedbacks (id);
CREATE INDEX ix_feedbacks_customer_phone ON feedbacks (customer_phone);
