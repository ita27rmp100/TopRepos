# TopRepos
A web project that showcases the top 50 open source repositories on GitHub for each country, based on specific criteria (detailed in this README).

> The project idea is inspired by [committers.top](https://committers.top/).

## Conditions
1. Your account must have at least 15 followers.
2. You must be among the top 20 most active GitHub users, according to the [committers.top](https://committers.top/) ranking.
3. Your GitHub account must be older than one year.

## How each project is graded :

**Total points =** (stars * 2) + (forks/2) + (watchers/2) - issues 
> Then GitHub Repositories are ranked highest to lowest total points

**How the project rank projects for each country :** The project follow the following steps :
1. Fetch the list of top 20 users from [committers.top](https://committers.top).
2. Filter the list, ensuring that each user has at least 15 followers and that the account is older than one year. If either of these conditions is not satisfied, the script will remove the user.
3. For each user in the filtered list, select their three most starred repositories. Calculate the total points for each repository (as described above), and add each one to the global top projects list as an object containing the owner/repository name, account avatar, and total points.
4. At the end, the script will sort the projects based on their total points and select the top 10.
5. Generate the HTML code for that country, insert it into the specific table in the CountryHTML folder, and when the pages run, the server will fetch the content from those files.

**Notes about the virst version :**
- you may find some defects, we will try to fix them as soon as possible, just let us know what they are.
- The project provides the list of top 10 projects for 47 country arround the world from different continents of the world, we will add more countries in next updates, inshallah.

## Installing :
To develop the project on your device :

```bash
git clone https://github.com/ita27rmp100/TopRepos.git
```

## Contributing
Contributions are welcome! 
If you have any suggestions or idea that can enhance the project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.