<script setup lang="ts">
import axios from 'axios'
import { computed, ref, type ComputedRef, type Ref } from 'vue'

interface DivVotes {
  name: string
  votes: number
  percentage: number
}

const raw_data: divisions = {
  A: 135,
  AE: 63,
  D: 188,
  DS: 121,
  E: 178,
  Exchange: 8,
  F: 230,
  GS: 199,
  H: 237,
  I: 207,
  IT: 212,
  K: 101,
  KfKb: 186,
  M: 175,
  Sjö: 98,
  TB: 46,
  TD: 69,
  Utomlandsstuderande: 25,
  V: 156,
  Z: 161
}

interface divisions {
  [key: string]: number
}

interface colours {
  [key: string]: string
}

const students_by_division: divisions = {
  A: 727,
  AE: 146,
  D: 892,
  DS: 1050,
  E: 865,
  F: 983,
  GS: 331,
  H: 1035,
  I: 731,
  IT: 681,
  K: 395,
  KfKb: 525,
  M: 1083,
  Sjö: 745,
  TB: 410,
  TD: 231,
  Utomlandsstuderande: 145,
  Exchange: 259,
  'Fristående Kurs': 21,
  V: 1084,
  Z: 694,
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
  axios
    .get('/data.json')
    .then((res) => create_vote_data(res.data))
    .catch(() => create_vote_data(raw_data))

  function create_vote_data(data: divisions) {
    const temp: DivVotes[] = []
    console.log(data)
    if (typeof data === 'object') {
      for (const name in data) {
        const votes: number = Number(data[name])
        const percentage: number = Math.round(
          (votes / students_by_division[name] + Number.EPSILON) * 1000
        )

        temp.push({ name, votes, percentage })
      }
    }
    temp.sort((a, b) => b.percentage - a.percentage)

    console.log(temp)
    vote_data.value = temp
  }
}
const vote_data: Ref<DivVotes[]> = ref([])

const filtered_data: ComputedRef<DivVotes[]> = computed(() => {
  return vote_data.value.filter((div) => div.name !== 'Fristående kurs' && div.name !== 'Exchange' && div.name !== 'Utomlandsstuderande')
})

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
      <h1>Live votes</h1>
      <h2>CURRENT TOTAL: {{ (total_percentage * 100).toFixed(1) }} %</h2>
      <h2>Voting percentage by student divisions</h2>
      <h3 class="mobile">Vote now at <a href="https://fumval.se">Fumval.se</a></h3>
    </hgroup>
    <img src="@/assets/logo.svg" alt="Logo for Fullmäktige Election 2024">
    <div class="division-wrapper">
      <div class="division" v-for="(division, index) in filtered_data" :key="division.name">
        <div class="percentage">{{ division.percentage / 10 }}%</div>
        <div class="bar-desktop desktop" :style="'height: ' +
          division.percentage / 10 +
          '%; background-color: ' +
          colours_by_division[division.name] +
          ';'
          "></div>
        <div class="bar-mobile mobile" :style="'width: ' +
          division.percentage / 12 +
          '%; background-color: ' +
          colours_by_division[division.name] +
          ';'
          "></div>
        <div class="name">{{ division.name }}</div>
      </div>
    </div>
    <h3 class="desktop">Vote now at <a href="https://fumval.se">Fumval.se</a></h3>
  </main>
</template>
