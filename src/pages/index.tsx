import {GetStaticProps } from 'next'

import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

//Cliente-side
//Server-side
//Static Size Generation

//Post do blog

//Conteudo (SSG)
//Comentários (Client-side) 

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} mounth</span>
          </p>
          
          <SubscribeButton priceId={product.priceId}/>

        </section>

        <img src='/images/avatar.svg' alt='Girl coding' />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1KbmLoDfKAMZy6HqopRRHDf1', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 Hours
  }
}
