import { NewJobInfo } from "src/clusterops/api/job";

export function parseSbatchOutput(output: string): number {
  // Submitted batch job 34987
  const splitted = output.split(" ");
  return +splitted[splitted.length - 1];
}

export interface JobMetadata {
  jobName: string;
  account: string;
  partition?: string;
  qos?: string;
  nodeCount: number;
  coreCount: number;
  maxTime: number;
  command: string;
  comment?: string;
  submitTime: string;
  workingDirectory: string;
}

export function generateJobScript(jobInfo: NewJobInfo & {
  output?: string;
  otherOptions?: string[];
}) {
  const {
    jobName, account, coreCount, maxTime, nodeCount,
    partition, qos, command, workingDirectory,
    output, otherOptions,
  } = jobInfo;
  let script = "#!/bin/bash\n";

  function append(param: string) {
    script += "#SBATCH " + param + "\n";
  }

  append("-A " + account);
  append("--partition=" + partition);
  append("--qos=" + qos);
  append("-J " + jobName);
  append("--nodes=" + nodeCount);
  append("-c " + coreCount);
  append("--time=" + maxTime);
  append("--chdir=" + workingDirectory);
  if (output) {
    append("--output=" + output);
  }
  if (otherOptions) {
    otherOptions.forEach((opt) => {
      append(opt);
    });
  }


  script += "\n";
  script += command;

  return script;
}

export const JOB_METADATA_NAME = "metadata.json";

