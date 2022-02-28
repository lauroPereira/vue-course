class Team {
    constructor(name, escudo) {
        this.name = name;
        this.escudo = escudo;

        this.points = 0;
        this.gm = 0;
        this.gs = 0;
    }

    endGame(opponent, goalsScored, goalsConceded) {
        if (this.tiedMatch(goalsScored, goalsConceded)) {
            this.tie(goalsScored, goalsConceded);
            opponent.tie(goalsConceded, goalsScored);
        } else {

            if (this.winMatch(goalsScored, goalsConceded)) {
                this.win(goalsScored, goalsConceded);
                opponent.loss(goalsConceded, goalsScored);
            } else {
                this.loss(goalsScored, goalsConceded);
                opponent.win(goalsConceded, goalsScored);
            }
        }
    }

    tiedMatch(goalsScored, goalsConceded) {
        return goalsScored === goalsConceded;
    }

    winMatch(goalsScored, goalsConceded) {
        return goalsScored > goalsConceded;
    }

    tie(goalsScored, goalsConceded) {
        this.updateScoreTable(1, goalsScored, goalsConceded)
    }

    win(goalsScored, goalsConceded) {
        this.updateScoreTable(3, goalsScored, goalsConceded)
    }

    loss(goalsScored, goalsConceded) {
        this.updateScoreTable(0, goalsScored, goalsConceded)
    }

    updateScoreTable(points, goalsScored, goalsConceded) {
        this.points += parseInt(points);
        this.gm += parseInt(goalsScored);
        this.gs += parseInt(goalsConceded);
    }

}