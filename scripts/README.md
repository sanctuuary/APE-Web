# Database scripts

This directory contains scripts to make the database setup easier.

## Docker

### Registering the first administrator user

To register the first administrator user on the website, follow these steps:
1. Register a user on the website.
2. Use the `register-admin.sh` script. This script requires the following parameters:
   - The MongoDB database container name.
   - The MongoDB database root username and password.
   - The e-mail address of the user which should be made an administrator.

After the script is done the user with the given e-mail address will be an administrator on the website.
