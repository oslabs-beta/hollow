<p align="center">
  <img src="./assets/hollow_logo_1.png">
</p>
<h4 align="center">
	A <a href="https://en.wikipedia.org/wiki/Headless_content_management_system">headless CMS</a> built in a <a href="https://deno.land">Deno</a> runtime environment.
</h4>

## Overview
Hollow is a first-of-its-kind headless CMS generating a backend exclusively in Deno. Hollow offers straightforward deployment through AWS, making it easy to manage your database, add content, and get an API up and running in minutes.

## Table of Contents
* [Installation](#Installation)
* [Guides](#Guides)
  * [Adding a New Collection](#Creating-a-New-Collection)
  * [Deleting a Collection](#Deleting-a-Collection)
  * [Adding a Field to Collection](#Adding-a-Field-to-Collection)
  * [Editing a Collection's Field](#Editing-a-Collection's-Field)
  * [Deleting a Collection's Field](#Deleting-a-Collection's-Field)
  * [Adding an Entry to a Collection](#Adding-an-Entry-to-a-Collection)
  * [Editing an Entry in a Collection](#Editing-an-Entry-in-a-Collection)
  * [Deleting an Entry from a Collection](#Deleting-an-Entry-from-a-Collection)
* [How To Contribute](#How-To-Contribute)
* [Contributors](#Contributors)

## Installation
Hollow is currently only configured for AWS. Create an AWS account [here](https://aws.amazon.com/console/) if you haven't already.

**WARNING:** You may incur charges by using AWS services. Please proceed at your own risk.
### Create an Elastic Beanstalk Instance
1. **Create a zipped repository.**
	- Clone this repo to your local machine by running `git clone https://github.com/oslabs-beta/hollow.git`.
	- In order to deploy Hollow, you'll need to zip the repo into an archive file. Navigate to your Hollow directory in Terminal and run the following command: `git archive -v -o hollow.zip --format=zip HEAD`.
2. **Create a new Elastic Beanstalk instance.**
	- Navigate to **Elastic Beanstalk** via the **Services** menu in AWS and click **Create Application**.
	- Give your application a name (e.g. `Hollow`).
	- Under **Platform**, select Docker. Leave the platform branch and version as is (Docker running on 64bit Amazon Linux 2, v3.2.4).
	- Under **Application code**, select **Upload your code**. In the **Source code origin** panel, click **Choose file** and upload the `hollow.zip` file generated in the previous step.
	- Click **Create application**.
### Create an RDS Database
1. **Create a new database.**
	- Navigate to **RDS** via the **Services** menu and click **Create database**.
	- Leave the database creation method as **Standard create**.
	- Under **Engine options**, select PostgreSQL, leaving the version as is.  Select **Free tier** in the **Templates** panel if you wish to avoid charges.
	- In the **Settings** panel, provide your database instance with a meaningful name, like `hollowdb-instance-1`. Create a master username and password. (*Write these down!* These will be your `RDS_USERNAME` and `RDS_PASSWORD` environment variables.)
	- In the **Storage** panel, edit your database instance size, storage type, and allocated storage as needed.
	- In the **Connectivity** panel, select **Create new** under **VPC security group**. Give the group the name `hollow-db-sg` and select the availability zone closest to you.
	- In the **Additional Configuration** panel, create an Initial Database Name. (*Write this down!* This will be your `RDS_DB_NAME` environment variable.)
	- Click **Create database**.
	- You'll need the endpoint for your RDS instance. Find this under **DB Instances**. This will be your `RDS_HOSTNAME` environment variable later.
2. **Modify your security group settings.**
	- Navigate to **EC2** via the **Services** menu and click **Security groups** under **Resources**.
	- Find your database security group—security group name should be `hollow-db`—and click the security group ID.
	- In the **Inbound rules** panel, click **Edit inbound rules** and **Add rule**.
	- Select PostgreSQL for **Type** and Custom for **Source**. Under **Source**, select the security group(s) associated with your Elastic Beanstalk EC2 environment.
	- Click **Save rules**.
### Connect to Your Database
1. **Set your database environment variables.**
	- Navigate back to **Elastic Beanstalk** via the **Services** menu.
	- In the sidebar under your Hollow production environment, navigate to **Configuration** > **Software**.
	- You'll need to give Hollow access to your RDS credentials by passing them as environment variables. Add the following variables under **Environment properties**:
		-   `RDS_HOSTNAME`: [your RDS endpoint]
		-   `RDS_DB_NAME`: [your RDS initial database name]
		-   `RDS_USERNAME`: [your username]
		-   `RDS_PASSWORD`: [your password]
		-   `RDS_PORT`: 5432
	- Click **Apply**.
2. **Go forth and conquer!**
	- Navigate to **EC2** via the **Services** menu.
	- Under your Hollow production environment, click **Go to environment**.
	- Your new Hollow application should be ready to go with your newly created database.

## Guides
* Adding a New Collection
* Deleting a Collection
* Adding a Field to Collection
* Editing a Collection's Field
* Deleting a Collection's Field
* Adding an Entry to a Collection
* Editing an Entry in a Collection
* Deleting an Entry from a Collection

## How To Contribute
If you come accross an issue you want to tackle or have a feature you think should be added, please feel free make a PR and someone from the core team will review it.

## Contributors
* [Matt Greenberg](https://github.com/mattagreenberg)
* [Shelby Cotton](https://github.com/shelbycotton)
* [Keith Lisiak](https://github.com/keithcoach)
* [Garrett Weaver](https://github.com/G-Weaver)
