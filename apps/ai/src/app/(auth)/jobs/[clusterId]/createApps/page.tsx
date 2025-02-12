/**
 * Copyright (c) 2022 Peking University and Peking University Institute for Computing and Digital Economy
 * OpenSCOW is licensed under Mulan PSL v2.
 * You can use this software according to the terms and conditions of the Mulan PSL v2.
 * You may obtain a copy of Mulan PSL v2 at:
 *          http://license.coscl.org.cn/MulanPSL2
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PSL v2 for more details.
 */

"use client";

import { usePublicConfig } from "src/app/(auth)/context";
import { PageTitle } from "src/components/PageTitle";
import { NotFoundPage } from "src/layouts/error/NotFoundPage";
import { ServerErrorPage } from "src/layouts/error/ServerErrorPage";
import { trpc } from "src/utils/trpc";

import { SelectAppTable } from "../SelectAppTable";


const useClusterAppConfigQuery = (clusterId: string) => {
  return trpc.jobs.listAvailableApps.useQuery({ clusterId });
};

export default function Page({ params }: { params: { clusterId: string } }) {
  const { clusterId } = params;

  const { publicConfig } = usePublicConfig();
  const cluster = publicConfig.CLUSTERS.find((x) => x.id === clusterId);


  if (!cluster) {
    return <NotFoundPage />;
  }

  const { data, isLoading, isError } = useClusterAppConfigQuery(clusterId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return (
      <ServerErrorPage />
    );
  }

  return (
    <>
      <PageTitle
        titleText="创建应用"
      />
      <SelectAppTable publicPath={publicConfig.PUBLIC_PATH} clusterId={clusterId} apps={data?.apps || []} />
    </>
  );
}
