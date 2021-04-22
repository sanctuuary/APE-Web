# This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
# © Copyright Utrecht University (Department of Information and Computing Sciences)
#!/bin/bash
echo "NOTE: Be sure to have registered a user before using this script!"
echo

# Request container name
read -p "The name of the database container [database]: " containername
# Use default value of "database" if no name is given
containername=${containername:-database}

# Request MongoDB credentials
read -p "Database root username [admin]: " $db_user
db_user=${db_user:-admin}
read -sp "Database root password [admin]: " $db_password
echo
db_password=${db_password:-admin}

# Request e-mail address of user who is to be made an admin
read -p "E-mail address used: " email

# Run mongodb queries to register user as an admin
script=$(sed "s/email@email.mail/$email/" useradmin-create.js)
echo "$script" | docker exec -i $containername sh -c "mongo -u $db_user -p $db_password"
