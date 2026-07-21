'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <section className="container mx-auto p-4">
      <SwaggerUI url="/api/swagger" />
    </section>
  );
}
