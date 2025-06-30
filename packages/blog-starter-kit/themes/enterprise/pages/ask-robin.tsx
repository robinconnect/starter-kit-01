import { Container } from '../components/container';

export default function AskRobinPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold mb-6">Ask Robin</h1>
      <p className="mb-6 text-lg text-neutral-700 dark:text-neutral-300">
        Have a question or need support? Fill out the form below and our team will get back to you!
      </p>
      <iframe
        data-tally-src="https://tally.so/r/wa1GN2"
        loading="lazy"
        width="100%"
        height="500"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Ask Robin Form"
        style={{ background: 'transparent' }}
      ></iframe>
    </Container>
  );
}