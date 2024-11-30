import type { DAppConnectorWalletAPI } from "@midnight-ntwrk/dapp-connector-api";
import { useState, useEffect } from "react";
import laceLogo from "./assets/lace.svg";

export type Midnight = {
  apiVersion: string;
  isLaceInstalled: boolean;
  isEnabled: boolean;
  userAddress: undefined | string;
  enable?: () => Promise<DAppConnectorWalletAPI>;
};

export type MidnightButtonProps = {
  styles?: React.CSSProperties;
};

export const useMidnight = async (): Promise<Midnight> => {
  // checks if midnight.js has been injected into the browser window
  if (window.midnight) {
    const midnight = window.midnight;
    if (midnight && midnight.mnLace) {
      const mnLace = midnight.mnLace;
      // checks if the dapp has been authorized
      const isEnabled = await mnLace.isEnabled();

      if (isEnabled) {
        // finds the user's address
        const api = await mnLace.enable();
        const state = await api.state();
        return {
          apiVersion: mnLace.apiVersion,
          isLaceInstalled: true,
          isEnabled,
          userAddress: state.address
        };
      }

      return {
        apiVersion: mnLace.apiVersion,
        isLaceInstalled: true,
        isEnabled,
        userAddress: "",
        enable: mnLace.enable
      };
    }
  }

  return {
    apiVersion: "",
    isLaceInstalled: false,
    isEnabled: false,
    userAddress: undefined
  };
};

export const MidnightButton = (props: MidnightButtonProps): JSX.Element => {
  let [midnight, setMidnight] = useState<undefined | Midnight>(undefined);

  const connectWallet = async (midnight: Midnight | undefined) => {
    if (midnight && midnight.enable) {
      const api = await midnight.enable();
      const state = await api.state();
      setMidnight({ ...midnight, isEnabled: true, userAddress: state.address });
    }
  };

  const defaultStyles = {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "10px",
    border: "solid 2px #050b1829",
    cursor: "pointer"
  };

  const truncateAddr = (addr: string | undefined): string => {
    if (!addr) {
      return "No address";
    } else {
      return `${addr.slice(0, 7)}...${addr.slice(-7)}`;
    }
  };

  useEffect(() => {
    useMidnight().then(mn => setMidnight(mn));
  }, []);

  return midnight && midnight.isLaceInstalled ? (
    midnight.isEnabled ? (
      <button style={props.styles || defaultStyles}>
        <img
          src={laceLogo}
          alt="lace"
          style={{ width: "20px", height: "20px" }}
        />
        <span>{truncateAddr(midnight.userAddress)}</span>
      </button>
    ) : (
      <button
        style={props.styles || defaultStyles}
        onClick={() => connectWallet(midnight)}
      >
        Connect Lace Wallet
      </button>
    )
  ) : (
    <a
      href="https://releases.midnight.network/#/wallet"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      Please install the Lace wallet to continue
    </a>
  );
};
