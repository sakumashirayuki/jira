import React from "react";
import { ProfilerOnRenderCallback } from "react";
import { ProfilerProps } from "react";

type Props = {
  metadata?: any;
  phases?: ("mount" | "update")[];
} & Omit<ProfilerProps, "onRender">;

let queue: unknown[] = [];
const sendProfileQueue = () => {
  if (!queue.length) return;
  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};

setInterval(sendProfileQueue, 5000); //模拟每5s发送一次queue的内容

export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interatctions
  ) => {
    //如果没有传入phases，则不论是mount还是updata，都要记录
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interatctions,
        metadata,
      });
    }
  };
  return <React.Profiler onRender={reportProfile} {...props} />;
};
