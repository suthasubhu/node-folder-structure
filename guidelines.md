#The following guide line should be implemented in all the projects.

#Login:
Login using username/email id
Incorrect Credential (more than certain attempts) - Lock account for 30 minutes
Login history should be maintained.
Account status should be maintained. Status are Active, Suspended, Deleted, Locked.
#Logs:
All the request and response log should be logged in the database (Based on projects if required).
All the error log should be logged in database
Error log should be sent via email (Send error log should be in on/off feature and we can add n number of mail id).
All the external api request and response should be logged in database (necessary)
Config:
There should be no config file should be used in backed until its necessary
All the configuration should be stored in database.
#Email:
Email configuration should be as multiple integration option. Runtime they can set the integration option as node mailer or mailchimp or mandril.
All the email should be stored in Email queue.
All the template should be stored in database. 
#JWTToken:
JWT Token should be stored in database
Token Expires should be followed.
Advance token validation should be there(if it necessary).
#Default:
Reusable code should be in common function
All the schema should have created_at, created_by, update_at, updated_by , delete_at, deleted_by fields.
Cross Origin request should be banned
Invalid url response should be set
If any error occurs application should be restart
Store assest's file in s3 which used to reduce load time.
All the files should be under s3. s3 bucket name -> folder name -> user id -> file name
#Advance:
Set page id for each page and make log user last visit page
