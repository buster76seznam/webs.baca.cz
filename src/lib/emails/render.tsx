
import { renderToStaticMarkup } from 'react-dom/server';
import { ReportEmail } from './report-email';

export const renderReportEmail = (props: React.ComponentProps<typeof ReportEmail>) => {
  return renderToStaticMarkup(<ReportEmail {...props} />);
};
