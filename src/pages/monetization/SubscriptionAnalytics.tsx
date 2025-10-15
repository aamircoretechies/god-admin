import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useLayout } from '@/providers';
import { SubscriptionAnalyticsContent } from './SubscriptionAnalyticsContent';

const SubscriptionAnalytics = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Analytics and insights for subscription growth and revenue trends.</ToolbarDescription>
            </ToolbarHeading>
                         <ToolbarActions>
               <Select defaultValue="6months" >
                 <SelectTrigger className="w-32 h-9 text-sm">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="1month">1 Month</SelectItem>
                   <SelectItem value="3months">3 Months</SelectItem>
                   <SelectItem value="6months">6 Months</SelectItem>
                   <SelectItem value="1year">1 Year</SelectItem>
                 </SelectContent>
               </Select>
               <a href="#" className="btn btn-sm btn-light">
                 Export Report
               </a>
               <a href="#" className="btn btn-sm btn-primary">
                 Generate Insights
               </a>
             </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <SubscriptionAnalyticsContent />
      </Container>
    </Fragment>
  );
};

export default SubscriptionAnalytics;
