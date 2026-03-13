# Template Showcase | X Cozmoh

A professional template showcase website with an integrated dashboard for managing and displaying website templates.

## Features

- 🎨 Interactive template gallery with search functionality
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔧 Admin panel to add new templates
- 📊 Professional dashboard with client information
- 🌐 Live website preview in iframe
- 💾 MySQL database integration

## Prerequisites

Before you begin, ensure you have the following installed:

- **XAMPP** (or WAMP/MAMP) - Includes Apache, MySQL, and PHP
  - Download from: https://www.apachefriends.org/

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Or download the ZIP file and extract it.

### 2. Move Files to XAMPP Directory

- Copy the entire project folder to your XAMPP `htdocs` directory
- Default location: `C:\xampp\htdocs\` (Windows) or `/Applications/XAMPP/htdocs/` (Mac)
- Example: `C:\xampp\htdocs\Template\`

### 3. Start XAMPP

1. Open XAMPP Control Panel
2. Start **Apache** (for PHP)
3. Start **MySQL** (for database)

### 4. Import Database

**Option A: Using phpMyAdmin (Recommended)**

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "Import" tab
3. Click "Choose File" and select `database.sql` from your project folder
4. Click "Go" button at the bottom
5. You should see a success message

**Option B: Using MySQL Command Line**

```bash
mysql -u root -p < database.sql
```

### 5. Verify Database Setup

1. In phpMyAdmin, you should see a database named `template`
2. Inside it, there should be a table named `templates`
3. The table should have sample data (3 templates)

### 6. Access the Website

Open your browser and navigate to:

```
http://localhost/Template/
```

Replace `Template` with your actual folder name if different.

## Usage

### Home Page
- View all templates in a grid layout
- Search for templates using the search bar
- Click "Copy Link" to copy template URLs

### Add Template Page
- Navigate to "Add Template" in the menu
- Fill in:
  - Template Name (e.g., "Modern Portfolio")
  - Template Link (e.g., "https://example.com")
- Click "Add Template"
- Template will appear on the home page

### Dashboard
- Navigate to "Dashboard" in the menu
- **Left Panel**: Client information, logo, notes, checklist
- **Right Panel**: Live website preview (Dr. Ram Kishan Nag website)
- Fully responsive on mobile devices

## Project Structure

```
Template/
├── index.html              # Main HTML file
├── style.css              # All styles and responsive design
├── script.js              # JavaScript functionality
├── add_template.php       # PHP script to add templates
├── get_templates.php      # PHP script to fetch templates
├── database.sql           # Database setup file
├── logo.jpg               # Medical logo image
└── README.md              # This file
```

## Database Configuration

If you need to change database settings, edit these files:

**get_templates.php** and **add_template.php**

```php
$db_host = 'localhost';    // Database host
$db_name = 'template';     // Database name
$db_user = 'root';         // Database username
$db_pass = '';             // Database password (empty by default)
```

## Troubleshooting

### Templates Not Loading

**Error: "Failed to load templates. Please ensure the PHP server is running."**

**Solutions:**
1. Make sure XAMPP Apache and MySQL are running
2. Verify you're accessing via `http://localhost/` not `file://`
3. Check if database exists in phpMyAdmin
4. Import `database.sql` if database is missing

### Database Connection Error

**Solutions:**
1. Verify MySQL is running in XAMPP
2. Check database credentials in PHP files
3. Ensure database name is `template`
4. Re-import `database.sql`

### Templates Not Displaying

**Solutions:**
1. Add templates using "Add Template" page
2. Check browser console for errors (F12)
3. Verify database has data: `SELECT * FROM templates;`

### Mobile Issues

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Ensure you're using latest browser version
3. Check if XAMPP is accessible on your network

## Uploading to GitHub

### First Time Setup

```bash
cd C:\xampp\htdocs\Template
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Updating Repository

```bash
git add .
git commit -m "Your commit message"
git push
```

### Important Files to Include

✅ Include:
- All `.html`, `.css`, `.js` files
- All `.php` files
- `database.sql` (database structure)
- `logo.jpg` and other images
- `README.md`

❌ Don't Include:
- Database backup files (`.sql` exports with data)
- XAMPP configuration files
- `.htaccess` (unless customized)

## Features Breakdown

### Home Page
- Template grid with responsive layout
- Real-time search functionality
- Copy link to clipboard feature
- Screenshot preview using WordPress mshots

### Dashboard
- Client information display
- Medical logo (80x80px)
- Brand colors showcase
- Client notes section
- Document upload area
- Production checklist (150 steps)
- Live website iframe preview
- Mobile responsive (stacked layout)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Icons**: Font Awesome 6.0
- **Server**: Apache (via XAMPP)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues:

1. Check the Troubleshooting section above
2. Verify XAMPP is running properly
3. Check browser console for errors (F12)
4. Ensure database is imported correctly

## Credits

Developed by X Cozmoh
Dashboard design for Dr. Ram Kishan Nag medical website

---

**Note**: This is a local development setup. For production deployment, you'll need:
- A web hosting service with PHP and MySQL support
- Update database credentials in PHP files
- Configure proper security measures
- Use HTTPS for production
