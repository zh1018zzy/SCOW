import { Logger } from "@ddadaal/tsgrpc-server";
import { ClusterOps } from "src/clusterops/api";
import { slurmAccountOps } from "src/clusterops/slurm/AccountService";
import { slurmJobOps } from "src/clusterops/slurm/JobService";
import { slurmStorageOps } from "src/clusterops/slurm/StorageService";
import { slurmUserOps } from "src/clusterops/slurm/UserService";
import { executeSlurmScript } from "src/clusterops/slurm/utils/slurm";
import { clusters } from "src/config/clusters";
import { misConfig, SlurmMisConfigSchema } from "src/config/mis";

export interface SlurmClusterInfo {
  slurmConfig: SlurmMisConfigSchema;
  partitions: string[];

  executeSlurmScript: (params: string[], logger: Logger) => ReturnType<typeof executeSlurmScript>;
}


export const createSlurmOps = (cluster: string): ClusterOps => {

  const clusterConfig = clusters[cluster];

  const slurmConfig = misConfig.clusters[cluster]?.slurm;

  if (!slurmConfig) {
    throw new Error(`the slurm property of cluster ${cluster} in mis.yaml.clusters is not set.`);
  }

  const partitions = Object.keys(clusterConfig.partitions);

  const clusterInfo: SlurmClusterInfo = {
    partitions,
    slurmConfig,
    executeSlurmScript: (params, logger) => executeSlurmScript(slurmConfig, partitions, params, logger),
  };

  return {
    account: slurmAccountOps(clusterInfo),
    storage: slurmStorageOps(clusterInfo),
    job:  slurmJobOps(clusterInfo),
    user: slurmUserOps(clusterInfo),
  };

};
