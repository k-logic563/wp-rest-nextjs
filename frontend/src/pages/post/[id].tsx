import Head from 'next/head'
import { GetStaticPropsContext, NextPage } from 'next'
import { InferGetStaticPropsType } from 'next'
import { Title, Text } from '@mantine/core'
import { ParsedUrlQuery } from 'querystring'

import { WPResponse } from '@/types'

type Props = InferGetStaticPropsType<typeof getStaticProps>
type Params = ParsedUrlQuery & {
  id: string
}

export const getStaticPaths = async () => {
  const result = await fetch(`http://localhost:8000/wp-json/wp/v2/posts`)
  const res = await result.json() as WPResponse[]

  const paths = res.map((x) => `/post/${x.id}`)

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<Params>) => {
  const { params } = ctx
  const postId = params?.id

  const result = await fetch(`http://localhost:8000/wp-json/wp/v2/posts/${postId}`)
  const res = await result.json() as WPResponse

  return {
    props: {
      post: res
    }
  }
}

const Home: NextPage<Props> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Title order={1} mb={8}>{ post.title.rendered }</Title>
        <Text mb={20}><time>{post.modified}</time></Text>
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </main>
    </>
  )
}

export default Home