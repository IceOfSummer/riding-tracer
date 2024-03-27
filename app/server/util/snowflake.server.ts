import { Snowflake } from 'nodejs-snowflake'

const snowflake = new Snowflake({
  instance_id: 1,
  custom_epoch: 1711872184266
})


export default snowflake