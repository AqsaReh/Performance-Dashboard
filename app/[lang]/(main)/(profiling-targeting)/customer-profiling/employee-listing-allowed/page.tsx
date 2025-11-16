import React from 'react';
import EmpListingPageView from './page-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Listing Allowed - Profiling & Targeting',
};

const EmpListingPage = async () => {
  return <EmpListingPageView />;
};

export default EmpListingPage;