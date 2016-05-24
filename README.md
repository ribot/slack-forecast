# Forecast Insights

Simple web service to receive [Forecast](http://forecastapp.com) utilisation insights through a Slack command.

Retrieves the following information:

| Key                         | Value                                      |
|-----------------------------|--------------------------------------------|
| Start date                  | Sunday, May 22nd 2016                      |
| End date                    | Sunday, May 29th 2016                      |
| Billable vs potential hours | 300 / 500                                  |
| Utilisation                 | 60%                                        |
| Projects                    | Google Playbook, M.Gemi and Harris + Hoole |

## Caveats

* Forecast's REST API is private at the moment, so a user's account ID and access token is required to make the requests. You'll have to grab this from your browser's web inspector and change it every 60 days. Yuck.
* Forecast doesn't tell you if an assignment is billable, you'll have to use a team label to determine whether a user is contributing to the utilisation, e.g. 'Production'.
* Forecast doesn't honour users who aren't full-time, which could skew the results.

## Slack setup

### Setting up a Slack command integration

You'll need to set up a [custom integration](https://api.slack.com/custom-integrations) on Slack, follow the instructions to set up a 'slash command'.

### Commands

Within Slack:

```
// Retrieve the overall utilisation for the current week
/<command name> 1 week

// Retrieve a weekly breakdown of utilisation for 2 weeks (including the current one)
/<command name> 3 weeks

// Retrieve the overall utilisation for the current month
/<command name> 1 month

// Make the response public within the current Slack channel
/<command name> 1 week public
```

## Development

### Running the app

```sh
npm install
```

Ensure you create a `.env` file in the route (or set the env vars explicity, you can refer to the `.env-example` file for the required properties.

## To do

* Tests 😁
* Ignore weekends
* Weekly/monthly breakdowns
* Make RESTful endpoints for additional use-cases
