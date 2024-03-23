// eslint-disable-next-line import/no-unresolved
import styles from 'antd-mobile-style/bundle/style.css'

export const loader = () => {
  return new Response(styles, {
    status: 200,
    headers: {
      'Content-Type': 'Text/css',
      'Cache-Control': 'max-age=2678400'
    }
  })
}