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

Vue.component('seasons-teams', {
    props: ['teams', 'season_id'],
    template: `
        <div class="col-md-4">
            <h3>{{get_season.name}}</h3>
            <ul>
                <li v-for="team in top">
                    <team-brand :obj="team"></team-brand>
                </li>
            </ul>
        </div>
    `,
    computed: {
        top() {
            return this.sortedTeams.slice(this.get_season.idx_start, this.get_season.idx_end);
        },
        get_season() {
            let season = {};

            switch (this.season_id) {
                case 0:
                    season.name = "Libertadores da América (Eliminatórias)";
                    season.idx_start = 0;
                    season.idx_end = 4;
                    break;
                case 1:
                    season.name = "Libertadores da América (Grupos)";
                    season.idx_start = 4;
                    season.idx_end = 6;
                    break;
                case 2:
                    season.name = "Times Rebaixados (Série B)";
                    season.idx_start = this.teams.length - 4;
                    season.idx_end = this.teams.length;
                    break;
            }
            return season;
        },
        sortedTeams() {
            return _.orderBy(this.teams, ['points', 'gm', 'gs'], ['desc', 'desc', 'asc']);
        }
    }
});

Vue.component('season-table', {
    props: ['teams'],
    data(){
        return {
            search: '',
            order: {
                cols: ['points', 'gm', 'gs'],
                sort: ['desc', 'desc', 'asc']
            },
        }
    },
    template: `
    <div>
        <input class="form-control" type="text" v-model="search">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th v-for="(col, idx) in order.cols">
                        <a href="#" @click="refreshScore(idx)">{{col}}</a>
                    </th>
                    </th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(team, idx) in resultSetTeams" 
                    :class="{'table-success': idx<4, 'table-danger': idx>12}"
                    :style="{'font-weight': idx>12?'bolder':'400px'}" >
                    <td>
                        <team-brand :obj="team" :mirror="false"></team-brand>
                    </td>
                    <td>{{team.points}}</td>
                    <td>{{team.gm}}</td>
                    <td>{{team.gs}}</td>
                    <!-- pipe '|' its a filter, that is used to transform data-->
                    <td>
                        <b class="text-danger">{{team | score | emphasis}}</b>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    computed: {
        resultSetTeams() {
            let teams_ordered = _.orderBy(this.teams, this.order.cols, this.order.sort);
            let self = this;

            return _.filter(teams_ordered, function (team) {
                let textSearch = self.search.toLowerCase();
                return team.name.toLowerCase().indexOf(textSearch) >= 0;
            })
            return teams;
        }
    },
    methods: {
        refreshScore(idx) {
            this.$set(this.order.sort, idx, (this.order.sort[idx] === 'desc') ? 'asc' : 'desc');
        }
    }
});

Vue.component('new-game', {
    props: ['homeTeam', 'visitorTeam'],
    data(){
        return {
            homeGoals: 0,
            visitorGoals: 0
        }
    },
    template: `
        <div class="row">
            <div class="col-md-5 row">
                <div class="col-md-10">
                    <team-brand  v-if="homeTeam" :obj="homeTeam" :mirror="false"></team-brand>
                </div>
                <div class="col-md-2">
                    <input class="form-control" type="number" v-model="homeGoals">
                </div>
            </div>
            <div class="col-md-1 text-center">
                <h1>vs.</h1>
            </div>
            <div class="col-md-5 row">
                <div class="col-md-2">
                    <input class="form-control" type="number" v-model="visitorGoals">
                </div>
                <div class="col-md-10">
                    <team-brand  v-if="visitorTeam" :obj="visitorTeam" :mirror="true"></team-brand>
                </div>
            </div>
            <div class="row offset-3 col-md-4">
                <button type="button" class="btn btn-success" @click="endGame">Fim de jogo</button>
            </div>
        </div>
    `,
    methods: {
        endGame() {
            this.homeTeam.endGame(this.visitorTeam, parseInt(this.homeGoals), this.visitorGoals);
            this.$emit('end-game');
            //this.mode = 'score';
        }
    }
});

new Vue({
    el: "#app",
    data: {
        mode: 'score',
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
        homeTeam: null,
        visitorTeam: null,
    },
    methods: {
        createGame() {
            this.mode = 'match';
            let id1 = Math.floor(Math.random() * this.teams.length),
                id2 = Math.floor(Math.random() * this.teams.length);

            while (id1 == id2) {
                id2 = Math.floor(Math.random() * this.teams.length);
            }

            this.homeTeam = this.teams[id1];
            this.visitorTeam = this.teams[id2];
        }
    }
})