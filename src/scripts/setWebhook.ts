import dotenv from 'dotenv'
dotenv.config({ path: '.dev.vars' })

const token = process.env.TOKEN
const url = process.argv[2]

if (!token) {
  console.error('Error: TOKEN not found in environment.')
  process.exit(1)
}

if (!url) {
  console.error('Usage: pnpm run set-webhook <your-tunnel-url>')
  process.exit(1)
}

const telegramUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`

fetch(telegramUrl)
  .then((res) => res.json())
  .then((data: any) => {
    if (data.ok) {
      console.log(`✅ Webhook set to: ${url}`)
    } else {
      console.error('❌ Failed to set webhook:', data.description)
    }
  })
  .catch((err) => {
    console.error('❌ Error calling Telegram API:', err.message)
  })
