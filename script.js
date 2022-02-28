Vue.component('titulo', {
    template: `
        <div class="row">
            <h3>Campeonato Brasileiro</h3>
        </div>`
});

Vue.component('team-brand', {
    props: ['obj', 'mirror'],
    template: 
    `
    <div style="display: flex; flex-direction: row">
        <img :src="obj.escudo" height="40" alt="" :style="{order: mirror?1:0}">
        <span :style="{order: mirror?0:1}">{{obj.name}}</span>
    </div>
    `
});

new Vue({
    el: "#app",
    data: {
        goals: 3,
        order: {
            cols: ['points', 'gm', 'gs'],
            sort: ['desc', 'desc', 'asc']
        },
        mode: 'score',
        search: '',
        teams: [
            new Team('América MG', 'assets/america-mg.png'),
            new Team('Botafogo', 'assets/botafogo.png'),
            new Team('Corinthias', 'assets/corinthias.png'),
            new Team('Grêmio', 'assets/gremio.png'),
            new Team('Palmeiras', 'assets/palmeiras.png'),
            new Team('Vasco', 'assets/vasco.png'),
            new Team('Atlético Mineiro', 'assets/atletico-mineiro.png'),
            new Team('Ceara', 'assets/ceara.png'),
            new Team('Flamengo', 'assets/flamengo.png'),
            new Team('Internacional', 'assets/internacional.png'),
            new Team('São Paulo', 'assets/sao-paulo.png'),
            new Team('Vitória', 'assets/vitoria.png'),
            new Team('Bahia', 'assets/bahia.png'),
            new Team('Chapecoense', 'assets/chapecoense.png'),
            new Team('Fluminense', 'assets/fluminense.png'),
            new Team('Nautico', 'assets/nautico.jpg'),
            new Team('Sport Recife', 'assets/sport-recife.png'),
        ],
        newGame: {
            team1: {
                team: null,
                goals: 0
            },
            team2: {
                team: null,
                goals: 0
            }
        },
    },
    computed: {
        top4() {
            return this.sortedTeams.slice(0, 4);
        },
        top6() {
            return this.sortedTeams.slice(4, 6);
        },
        last4() {
            return this.sortedTeams.slice(this.teams.length - 4, this.teams.length);
        },
        sortedTeams() {
            let teams = _.orderBy(this.teams, this.order.cols, this.order.sort);

            return teams;
        },
        resultSetTeams() {
            console.log('pesquisa');
            let teams = _.orderBy(this.teams, this.order.cols, this.order.sort);
            let self = this;

            return _.filter(teams, function (team) {
                let textSearch = self.search.toLowerCase();
                return team.name.toLowerCase().indexOf(textSearch) >= 0;
            })
            return teams;
        }
    },
    methods: {
        createGame() {
            this.mode = 'match';
            let id1 = Math.floor(Math.random() * this.teams.length),
                id2 = Math.floor(Math.random() * this.teams.length);

            while (id1 == id2) {
                id2 = Math.floor(Math.random() * this.teams.length);
            }

            this.newGame.team1.team = this.teams[id1];
            this.newGame.team1.goals = 0;
            this.newGame.team2.team = this.teams[id2];
            this.newGame.team2.goals = 0;
        },

        endGame() {
            let goalsTeam1 = parseInt(this.newGame.team1.goals);
            let goalsTeam2 = parseInt(this.newGame.team2.goals);
            let opponent = this.newGame.team2.team;
            let team = this.newGame.team1.team;
            team.endGame(opponent, goalsTeam1, goalsTeam2);
            this.mode = 'score';
        },
        refreshScore(idx) {
            console.log("Atualizou a tabela");
            console.log(this.order);
            console.log(this.order.cols[idx] + "->" + this.order.sort[idx]);
            //this.order.sort[idx] = (this.order.sort[idx] === 'desc')?'asc':'desc';
            this.$set(this.order.sort, idx, (this.order.sort[idx] === 'desc') ? 'asc' : 'desc');
        }
    }
})