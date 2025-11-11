CREATE TABLE `flowers` (
`flower_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`name` VARCHAR(50) NOT NULL,
`price` DECIMAL(10,  2) NOT NULL,
`is_available` BOOLEAN NOT NULL DEFAULT TRUE,
`colors` VARCHAR(50) NOT NULL,
`date_added` DATE NOT NULL,
`image_url` VARCHAR(255) DEFAULT NULL
);

CREATE TABLE `flower_images`(
`image`
);

CREATE TABLE `customers`(
`customer_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`name` VARCHAR(50) NOT NULL,
`phone_number` VARCHAR(13) NOT NULL 
);

CREATE TABLE `orders`(
`order_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`customer_id` INT UNSIGNED NOT NULL,
`order_date` DATE NOT NULL,
`total_amount` DECIMAL(10, 2) NOT NULL,

FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`)
);

CREATE TABLE `order_items`(
`order_items_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`order_id` INT UNSIGNED NOT NULL,
`flower_id` INT UNSIGNED NOT NULL,
`number_of_items` INT(10),

FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`),
FOREIGN KEY (`flower_id`) REFERENCES `flowers`(`flower_id`)
);

CREATE TABLE `deliveries`(
`delivery_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`order_id` INT UNSIGNED NOT NULL,

FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
);

CREATE TABLE `payments`(
`payment_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`order_id` INT UNSIGNED NOT NULL,

FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
);
