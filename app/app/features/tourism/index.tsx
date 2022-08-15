import { H2, Text, XStack } from "@cz3/app_ui";
import { Outlet } from "react-router";
import { ScrollView } from "react-native";
import { PageWithSidebar } from "@cz3/app/components/PageWithSidebar";

export function TourismScreen() {
  return (
    <PageWithSidebar
      sidebar={
        <>
          <XStack ai="center">
            <H2>Tourism</H2>
          </XStack>
          <Text fontFamily="$body">
            This is a sidebar. I might put some things here eventually.
          </Text>
        </>
      }
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Outlet />
      </ScrollView>
    </PageWithSidebar>
  );
}
