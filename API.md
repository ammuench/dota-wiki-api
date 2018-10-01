# Dota Wiki Api Docs
A full list of Dota Wiki Api setup, methods, and return types.

## Setup & Options
How to initialize, setup, and configure `DotaWikiApi`.

### Interfaces

* **IDotaWikiConfig**

  An object type that contains all required and optional config values.  Must be passed into the `DotaWikiApi` constructor when initalizing the module.
  ```typescript
    interface IDotaWikiConfig {
        userAgentValue: string;
    }
  ```

### Options

  * **userAgentValue (Required)**

    A string that represents your user agent, that is sent on every network call to the API, per the [Liquipedia API Guidlines](http://www.teamliquid.net/forum/hidden/491339-liquipedia-api-usage-guidelines)

    ```text
    Use a custom HTTP "User-Agent" header in your requests that identifies your project / use of the API, and includes contact information. Example: "User-Agent: LiveScoresBot/1.0 (http://www.example.com/; email@example.com)".
    ```

## Rankings
All methods related to DPC rankings and standings.

### Interfaces

* **IRank**

  An object type that contains the rank, team, points, and statuses on wether a team has clinched or is ineligible.  Also includes optional error info.
  ```typescript
    interface IRank {
        errorMsg?: string;
        hasError?: boolean;
        isClinched: boolean;
        isIneligible: boolean;
        rank: string;
        score: string;
        team: string;
    }
  ```

* **IRankKey**

  An object type used as the key in the rank map.
  ```typescript
    interface IRankKey {
        rank?: string;
        team?: string;
    }
  ```

### Methods

  * **getTeamByStanding(rank: number): Promise\<IRank\>**

    Fetches an `IRank` object for the rank value provided.
    On error, provides data on the `errorMsg` prop.
    On invalid rank, provides info on the `errorMsg` prop.

  * **getRankByTeamname(team: string): Promise\<IRank\>**

    Fetches an `IRank` object for the team name provided (case insensitive).
    
    On error, provides data on the `errorMsg` prop.
    On invalid team name, provides info on the `errorMsg` prop.

  * **getAllRanks(): Promise<Map\<IRankKey, IRank\> | string>**

    On success, fetches a map with keys `IRankKEy` and values `IRank`.  Values are returned in descending order by rank.
    On error, provides an error message as a string

## Teams
All methods and info related to Dota2 teams

### Interfaces

  * **ITeam**

  An object type that contains basic info for a dota team
  ```typescript
    interface ITeam {
      name: string;
      roster: ITeamMember[];
      teamLogo?: string;
      location?: string;
      region: string;
      manager?: string;
      captain?: string;
      earnings?: string;
      rank?: string;
    }
  ```

  * **ITeamMember**

  An object type that contains basic info for a dota team member
  ```typescript
    interface ITeamMember {
      handle: string;
      isCaptain: boolean;
      joinDate: string;
      name: string;
      position: string;
      region: string;
    }
  ```

### Methods

  * **getTeam(teamName: string): Promise\<ITeam\>**

    Fetches an `ITeam` object for the team name provided. 
    Will try and correct for variations by following the first redirect if need be, otherwise returns an error. 
    Team roster provided as an array of `ITeamMember` objects

## Players
All methods and info related to Dota2 Players

### Interfaces

  * **IPlayer**

  An object type that contains basic info for a dota team
  ```typescript
    interface IPlayer {
      handle: string;
      name: string;
      photo: string;
      position: string[];
      region?: string[];
      birthday?: string;
      earnings?: string;
      team?: string;];
    }
  ```

### Methods

  * **getPlayer(playerName: string): Promise\<IPlayer\>**

    Fetches an `IPlayer` object for the team name provided. 
    Will try and correct for name variations by following the first redirect if need be, otherwise returns an error. 

## Matches
All methods and info related to Dota2 Players

### Interfaces

  * **IMatch**

  An object type that contains basic info for a match.  `startTime` is provided as ISO.  Scores are provided on  live matches.  Team and Tournament URLs are provided if they exist in Liquipedia
  ```typescript
    interface IMatch {
      team1: string;
      team1Score?: number;
      team1URL?: string;
      team2: string;
      team2Score?: number;
      team2URL?: string;
      startTime?: string;
      tournament: string;
      tournamentURL: string;
    }
  ```

  * **IMatchList**

  An object type that arrays of live and upcoming matches.  If there are no live/upcoming matches an empty array will return
  ```typescript
    interface IMatchList {
      liveGames: IMatch[];
      upcomingGames: IMatch[];
    }
  ```

### Methods

  * **getMatches(): Promise\<IMatchList\>**

    Fetches an `IMatchList` object.