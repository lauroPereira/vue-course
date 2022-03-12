Vue.component('my-app', {
    template: `
    <div id="app" class="container">
        <titulo></titulo>
        <br>
        <new-game @new-game="showGame($event)"></new-game>
        <br><br>
        <!-- v-if destroy on else; v-show display none on else-->
        <!-- @end-game is sendding from new-game vue component-->
        <score v-if="mode!='score'" :home-team="homeTeam" :visitor-team="visitorTeam" @end-game="mode = 'score'"></score>
        <season-table v-else ></season-table>
        <div class="row">
            <seasons-teams :teams="teams" :season_id="0"></seasons-teams>
            <seasons-teams :teams="teams" :season_id="1"></seasons-teams>
            <seasons-teams :teams="teams" :season_id="2"></seasons-teams>
        </div>
    </div>
    `,
    provide(){
        return {
            teamsCollection: [
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
            ]
        }
    },
    data(){
        return {
            mode: 'score',
            homeTeam: null,
            visitorTeam: null,
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
            ]
        }
    },
    methods: {
        showGame({homeTeam, visitorTeam}){
            this.homeTeam = homeTeam;
            this.visitorTeam = visitorTeam;
            this.mode = 'match';
        }
    }
});

Vue.component('titulo', {
    template: `
        <div class="row">
            <h3 @click="clicked">Campeonato Brasileiro - {{$parent.mode}}</h3>
        </div>
    `,
    methods: {
        clicked(){
            console.log(this.$parent.mode);
        }
    }
});

Vue.component('score', {
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

Vue.component('season-table', {
    data(){
        return {
            search: '',
            order: {
                cols: ['points', 'gm', 'gs'],
                sort: ['desc', 'desc', 'asc']
            },
            teams: this.teamsCollection
        }
    },
    inject: ['teamsCollection'],
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
            let sorted_teams;

            sorted_teams = _.filter(teams_ordered, function (team) {
                let textSearch = self.search.toLowerCase();
                return team.name.toLowerCase().indexOf(textSearch) >= 0;
            });

            this.$parent.teams = sorted_teams;
            
            return sorted_teams;
        }
    },
    methods: {
        refreshScore(idx) {
            this.$set(this.order.sort, idx, (this.order.sort[idx] === 'desc') ? 'asc' : 'desc');
        }
    }
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

Vue.component('new-game', {
    template: `
    <div class="row offset-3 col-md-4">
        <button class="btn btn-info" @click="createGame">Criar partida</button>
    </div>
    `,
    data() {
        return {
            teams: this.teamsCollection
        }
    },
    inject: ['teamsCollection'],
    methods: {
        createGame() {
            let id1 = Math.floor(Math.random() * this.teamsCollection.length),
                id2 = Math.floor(Math.random() * this.teamsCollection.length);

            while (id1 == id2) {
                id2 = Math.floor(Math.random() * this.teamsCollection.length);
            }

            var homeTeam = this.teamsCollection[id1];
            var visitorTeam = this.teamsCollection[id2];
            this.$emit('new-game',{homeTeam, visitorTeam});
        }
    }
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
    template: `<my-app></my-app>`
})