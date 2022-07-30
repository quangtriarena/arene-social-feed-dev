import CountryRepository from '../repositories/country.js'
import CustomerRepository from '../repositories/customer.js'
import UserRepository from '../repositories/user.js'

import countries from './countries.js'
import customers from './customers.js'
import users from './users.js'

const initCountries = async () => {
  try {
    console.log(`👉 Init countries`)

    let count = await CountryRepository.count()
    if (count > 0) {
      console.log(`\t Countries already exist!`)
      return
    }

    for (let i = 0, leng = countries.length; i < leng; i++) {
      await CountryRepository.create(countries[i])
        .then((res) => console.log(`\t [${i + 1}/${leng}] country created`))
        .catch((err) =>
          console.log(`\t [${i + 1}/${leng}] create country failed with error: ${err.message}`),
        )
    }
  } catch (error) {
    console.log('initCountries error :>> ', error)
  }
}

const initCustomers = async () => {
  try {
    console.log(`👉 Init customers`)

    let count = await CustomerRepository.count()
    if (count > 0) {
      console.log(`\t Customers already exist!`)
      return
    }

    let _countries = await CountryRepository.find({ limit: 100 })
    _countries = _countries.items

    for (let i = 0, leng = customers.length; i < leng; i++) {
      let countryId = _countries[Math.floor(Math.random() * _countries.length)].id

      await CustomerRepository.create({ ...customers[i], countryId })
        .then((res) => console.log(`\t [${i + 1}/${leng}] customer created`))
        .catch((err) =>
          console.log(`\t [${i + 1}/${leng}] create customer failed with error: ${err.message}`),
        )
    }
  } catch (error) {
    console.log('initCustomers error :>> ', error)
  }
}

const initUsers = async () => {
  try {
    console.log(`👉 Init users`)

    let count = await UserRepository.count()
    if (count > 0) {
      console.log(`\t Users already exist!`)
      return
    }

    let _countries = await CountryRepository.find({ limit: 100 })
    _countries = _countries.items

    for (let i = 0, leng = users.length; i < leng; i++) {
      let countryId = _countries[Math.floor(Math.random() * _countries.length)].id

      await UserRepository.create({ ...users[i], countryId })
        .then((res) => console.log(`\t [${i + 1}/${leng}] user created`))
        .catch((err) =>
          console.log(`\t [${i + 1}/${leng}] create user failed with error: ${err.message}`),
        )
    }
  } catch (error) {
    console.log('initUsers error :>> ', error)
  }
}

const init = async () => {
  await initCountries()
  await initCustomers()
  await initUsers()

  console.log('✅ Database init done!')
}

init()
