import Head from 'next/head';
import { useEffect } from 'react';
import { GetStaticProps } from 'next';
import request from 'graphql-request';
import { Container } from '../components/container';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Layout } from '../components/layout';
import { AppProvider } from '../components/contexts/appContext';
import { useAppContext } from '../components/contexts/appContext';
import { PostsByPublicationDocument, PublicationFragment } from '../generated/graphql';

type Props = {
  publication: PublicationFragment;
};

function AskRobinContent() {
  const { publication } = useAppContext();
  
  useEffect(() => {
    // Load Tally script for better embedding
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Ask Robin - {publication?.title}</title>
        <meta name="description" content="Have a question or need support? Get in touch with Robin and our team will help you out." />
        <meta property="og:title" content="Ask Robin" />
        <meta property="og:description" content="Have a question or need support? Get in touch with Robin and our team will help you out." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Container className="py-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
              Ask Robin
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Have a question about China business, supply chain, or need support? 
              Fill out the form below and Robin will get back to you promptly!
            </p>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-2">
            <iframe
              data-tally-src="https://tally.so/r/wa1GN2"
              loading="lazy"
              width="100%"
              height="600"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Ask Robin Form"
              style={{ 
                background: 'transparent',
                borderRadius: '8px'
              }}
            ></iframe>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

export default function AskRobinPage({ publication }: Props) {
  return (
    <AppProvider publication={publication} post={null}>
      <Layout>
        <Header />
        <AskRobinContent />
        <Footer />
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
    PostsByPublicationDocument,
    {
      first: 0, // We only need publication data, not posts
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST!,
    },
  );

  if (!data.publication) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      publication: data.publication,
    },
    revalidate: 1,
  };
};
