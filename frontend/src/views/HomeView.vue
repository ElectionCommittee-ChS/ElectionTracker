<script setup lang="ts">
import axios from 'axios'
import { computed, ref, type ComputedRef, type Ref } from 'vue'

interface DivVotes {
  name: string
  votes: number
  percentage: number
}

const raw_data: string[] = [
  'A',
  '10',
  'D',
  '52',
  'DS',
  '3',
  'E',
  '29',
  'F',
  '42',
  'GS',
  '31',
  'H',
  '19',
  'I',
  '126',
  'IT',
  '59',
  'K',
  '15',
  'KfKb',
  '25',
  'M',
  '69',
  'Sjö',
  '3',
  'TD',
  '3',
  'Utomlandsstuderande',
  '6',
  'V',
  '93',
  'Z',
  '7'
]

interface divisions {
  [key: string]: number
}

interface colours {
  [key: string]: string
}

const students_by_division: divisions = {
  A: 655,
  D: 783,
  DS: 955,
  E: 729,
  F: 908,
  GS: 197,
  H: 111 + 208 + 173 + 613,
  I: 705,
  IT: 645,
  K: 394,
  KfKb: 534,
  M: 1142,
  Sjö: 388 + 111,
  TD: 232,
  Utomlandsstuderande: 94,
  Exhange: 254,
  'Fristående Kurs': 16,
  V: 1033,
  Z: 604,
  TB: 338,
  AE: 125
}

const colours_by_division: colours = {
  A: '#cc0000',
  D: '#fa6607',
  DS: 'darkseagreen',
  E: '#ffff00',
  F: 'black',
  GS: '#efc26a',
  H: '#eb79ab',
  I: '#9F36A1',
  IT: '#09cdda',
  K: '#5c9143',
  KfKb: '#3D7620',
  M: '#795548',
  Sjö: '#1F2163',
  TD: '#600010',
  Utomlandsstuderande: 'light-grey',
  V: '#3d85c6',
  Z: '#6E6E6E',
  TB: 'Beige',
  AE: '#54ce59'
}

async function get_vote_data() {
  let data: string[] = []
  axios
    .get('/data.json')
    .then((res) => create_vote_data(res.data))
    .catch(() => create_vote_data(raw_data))

  function create_vote_data(data: any) {
    const temp: DivVotes[] = []
    console.log(data)
    if (Array.isArray(data)) {
      while (data.length > 1) {
        const name: string = data.shift()
        const votes: number = Number(data.shift())
        const percentage: number = Math.round(
          (votes / students_by_division[name] + Number.EPSILON) * 1000
        )

        if (name === "Fristående kurs") continue;
        if (name === "Exchange") continue;
        if (name === "Utomlandsstuderande") continue;

        temp.push({ name, votes, percentage })
      }
    }
    temp.sort((a, b) => b.percentage - a.percentage)

    console.log(temp)
    vote_data.value = temp
  }
}
const vote_data: Ref<DivVotes[]> = ref([])

get_vote_data()

const total_percentage = computed(() => {
  const total_votes: number = vote_data.value.reduce(
    (sum: number, div: DivVotes) => sum + div.votes,
    0
  )

  const total_students: number = Object.entries(students_by_division).reduce(
    (sum: number, div: any[]) => sum + div[1],
    0
  )

  console.log(total_students, total_votes)

  return Math.round((total_votes / total_students + Number.EPSILON) * 1000) / 1000
})
</script>

<template>
  <main>
    <hgroup>
      <h1>FuM Election 2024</h1>
      <h2>CURRENT TOTAL: {{ total_percentage * 100}} %</h2>
      <h2>Voting percentage by student divisions</h2>
      <h3>Vote now at <a href="https://fumval.se">Fumval.se</a></h3>
    </hgroup>
    <img src="@/assets/logo.svg" alt="Logo for Fullmäktige Election 2024">
    <div class="division-wrapper">
      <div class="division" v-for="(division, index) in vote_data" :key="division.name">
        <div class="percentage">{{ division.percentage / 10 }}%</div>
        <div class="bar-desktop" :style="'height: ' +
        division.percentage / 10 +
        '%; background-color: ' +
        colours_by_division[division.name] +
        ';'
        "></div>
        <div class="bar-mobile" :style="'width: ' +
        division.percentage / 10 +
        '%; background-color: ' +
        colours_by_division[division.name] +
        ';'
        "></div>
        <div class="name">{{ division.name }}</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 1280px;
  padding: 3rem;
  font-weight: normal;
  background-color: white;
  border-radius: 10px;
  margin: 5px;
}

h1 {
  font-weight: 900;
  font-size: 3em;
  font-style: italic;
  filter: drop-shadow(5px 5px 0px #00ACFF11);
}

h2 {
  font-weight: bold;
  font-size: 2em;
}

h3 {
  font-size: 1.5em;
}

hgroup a {
  display: inline-block;
  font-style: italic;
  padding: 0px 10px;
  border-radius: 7px;
  background-color: #00acff;
  color: white;
  text-decoration: 0.5px underline;
  font-weight: bold;
  transition: 0.3s;
}

hgroup a:hover {
  background-color: #007fbe;
  text-decoration: none;
  filter: drop-shadow(3px 3px 0px #00ACFF11);
}

hgroup {
  margin-bottom: 20px;
}

.division>div {
  padding: 5px;
  margin-bottom: 5px;
}

.division-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  margin: 20px 0;
  height: 60vh;
}

.division {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 4vw;
  margin: 0 5px;
}

.percentage,
.name {
  font-size: 1.2em;
  font-weight: bold;
}

.bar-desktop {
  width: 100%;
  transition: height 0.3s ease;
}

.bar-mobile {
  display: none;
}

main>img {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  margin: 50px;
  transition: width 0.3s ease;
}

@media (max-width: 1000px) {
  main {
    padding: 2rem;
    min-width: 90vw;
  }

  .bar-desktop {
    display: none;
  }

  .bar-mobile {
    display: block;
    transition: width 0.3s ease;
  }

  .division-wrapper {
    flex-direction: column;
    height: 100%;
  }

  .division {
    flex-direction: row-reverse;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
  }

  .division>div {
    height: 40px;
  }

  .name {
    width: 55px;
    text-align: center;
  }

  main>img {
    top: initial;
    bottom: 0;
    width: 175px;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.8em;
  }

  h2 {
    font-size: 1.2em;
  }

  h3 {
    font-size: 1.2em;
  }

  main>img {
    width: 100px;
  }
}
</style>
