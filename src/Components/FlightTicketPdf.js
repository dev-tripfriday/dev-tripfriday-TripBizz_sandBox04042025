import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Add any custom fonts you might need

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    backgroundColor: "#E8EAF6",
    padding: 10,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "100%",
    border: "1px solid #d3d3d3",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #d3d3d3",
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    flexGrow: 1,
    borderRight: "1px solid #d3d3d3",
  },
  tableCellHeader: {
    backgroundColor: "#C5CAE9",
    fontWeight: "bold",
  },
  sectionHeader: {
    backgroundColor: "#C5CAE9",
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ticketDetails: {
    display: "table",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textBold: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 8,
  },
  barcode: {
    width: 80,
    height: 40,
    marginLeft: 10,
  },
  footer: {
    fontSize: 10,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  note: {
    marginTop: 10,
    fontSize: 9,
    color: "grey",
  },
});

// Create Document Component
const FlightTicketPdf = () => (
  <Document>
    <Page size="A3" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>E-Ticket</Text>

      {/* Trip Information */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16 }}>TripFriday (QuikProcess Pvt Ltd)</Text>
        <Text style={{ fontSize: 16 }}>
          Shriven a1 plot 41 phase 1 kamalapuri colony, Hyderabad
        </Text>
        <Text style={{ fontSize: 16 }}>Contact No: 9949269044</Text>
      </View>

      {/* PNR and Departure Information */}
      <View style={styles.ticketDetails}>
        <Text style={styles.textBold}>PNR No.: IX-A99MWK</Text>
        <Text style={styles.textBold}>Departure: 24-Oct-2024 9:10 AM, Thu</Text>
        <Text style={styles.textBold}>Arrival: 24-Oct-2024 10:55 AM, Thu</Text>
      </View>

      {/* Passenger Information */}
      <Text style={styles.sectionHeader}>Passenger Information</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Passenger Name</Text>
          <Text style={styles.tableCell}>Passenger Type</Text>
          <Text style={styles.tableCell}>GST No.</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Mr Lokanath Biswal</Text>
          <Text style={styles.tableCell}>Adult</Text>
          <Text style={styles.tableCell}>36AABCV6422B1ZP</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Ms Manaswini Mohanty</Text>
          <Text style={styles.tableCell}>Adult</Text>
          <Text style={styles.tableCell}>--</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Mr Arnav Samal</Text>
          <Text style={styles.tableCell}>Adult</Text>
          <Text style={styles.tableCell}>--</Text>
        </View>
      </View>

      {/* Flight Information */}
      <Text style={styles.sectionHeader}>Flight Details</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Flight</Text>
          <Text style={styles.tableCell}>Departure</Text>
          <Text style={styles.tableCell}>Arrival</Text>
          <Text style={styles.tableCell}>Status</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Air India Express IX 1936</Text>
          <Text style={styles.tableCell}>BBI (Bhubaneshwar)</Text>
          <Text style={styles.tableCell}>HYD (Hyderabad)</Text>
          <Text style={styles.tableCell}>Confirmed</Text>
        </View>
      </View>

      {/* Ancillary Details */}
      <Text style={styles.sectionHeader}>Passenger and Ancillary Details</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Passenger</Text>
          <Text style={styles.tableCell}>Seat</Text>
          <Text style={styles.tableCell}>Baggage</Text>
          <Text style={styles.tableCell}>Barcode</Text>
        </View>
        {/* Passenger 1 */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Mr Lokanath Biswal</Text>
          <Text style={styles.tableCell}>9B</Text>
          <Text style={styles.tableCell}>15KG</Text>
          <Image
            style={styles.barcode}
            src="https://barcode.tec-it.com/barcode.ashx?data=123456789012"
          />
        </View>
        {/* Passenger 2 */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Ms Manaswini Mohanty</Text>
          <Text style={styles.tableCell}>9A</Text>
          <Text style={styles.tableCell}>15KG</Text>
          <Image
            style={styles.barcode}
            src="https://barcode.tec-it.com/barcode.ashx?data=987654321098"
          />
        </View>
        {/* Passenger 3 */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Mr Arnav Samal</Text>
          <Text style={styles.tableCell}>9C</Text>
          <Text style={styles.tableCell}>15KG</Text>
          <Image
            style={styles.barcode}
            src="https://barcode.tec-it.com/barcode.ashx?data=543210987654"
          />
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Important: This is an Electronic Ticket. Passengers must carry a valid
        photo ID for check-in at the airport.
      </Text>
      <Text style={styles.note}>
        Note: We recommend purchasing travel insurance for your trip. Please
        contact your travel advisor for insurance.
      </Text>
    </Page>
  </Document>
);

export default FlightTicketPdf;
