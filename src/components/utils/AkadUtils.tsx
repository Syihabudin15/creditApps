"use client";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  Font,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { IDapem } from "../IInterfaces";

Font.register({
  family: "SourceSansPro",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf",
    }, // font-style: normal, font-weight: normal
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkA.ttf",
      fontWeight: 600,
    },
  ],
});
const tw = createTw({
  theme: {
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});
const style = StyleSheet.create({
  pages: {
    padding: 30,
    fontFamily: "SourceSansPro",
    fontSize: 10,
  },
});
export const UIAkad = ({ currData }: { currData: IDapem }) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <Document
        title={"AKAD " + currData.DetailDapem.DataDebitur.nama.toUpperCase()}
      >
        <Analisa data={currData} />
      </Document>
    </PDFViewer>
  );
};

export const Analisa = ({ data }: { data: IDapem }) => {
  return (
    <Page size={"A4"} style={style.pages}>
      <View
        style={tw(
          "text-center flex flex-col items-center justify-center gap-2 font-bold text-xl"
        )}
      >
        <Image
          src={process.env.NEXT_PUBLIC_APP_LOGO || "/logo.png"}
          style={{ width: 50 }}
        />
        <Text>ANALISA PERHITUNGAN</Text>
      </View>
      <View style={tw("flex flex-row gap-2 mt-8 mb-4")}>
        {/* Left */}
        <View
          style={tw("w-[48%] text-xs border rounded-sm border-gray-200 p-1")}
        >
          <View
            style={tw(
              "bg-green-500 p-1 rounded-sm text-center mb-3 text-gray-50 font-bold text-sm"
            )}
          >
            <Text style={tw("font-bold")}>DATA PEMOHON</Text>
          </View>
          <View style={tw("flex flex-row gap-2 mb-1")}>
            <Text style={tw("flex-1")}>Nama Pemohon</Text>
            <Text style={tw("flex-1 text-right")}>
              {data.DetailDapem.DataDebitur.nama.toUpperCase()}
            </Text>
          </View>
        </View>
        {/* Right */}
        <View
          style={tw("w-[48%] text-xs border rounded-sm border-gray-200 p-1")}
        >
          <View
            style={tw(
              "bg-red-500 p-1 rounded-sm text-center mb-3 text-gray-50 font-bold text-sm"
            )}
          >
            <Text style={tw("font-bold")}>RINCIAN PEMBIAYAAN</Text>
          </View>
          <View style={tw("flex flex-row gap-2 mb-1")}>
            <Text style={tw("flex-1")}>Nama Pemohon</Text>
            <Text style={tw("flex-1 text-right")}>
              {data.DetailDapem.DataDebitur.nama.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};
