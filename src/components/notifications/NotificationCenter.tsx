import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Calendar, FileText, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { deadlines, universities } from "@/data/mockData";
import { differenceInDays, format } from "date-fns";
import { useState } from "react";

export function NotificationCenter() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Generate notifications based on deadlines and university status
  const generateNotifications = () => {
    const notifications = [];
    const now = new Date();

    // Deadline notifications
    deadlines.forEach(deadline => {
      const daysUntil = differenceInDays(new Date(deadline.date), now);
      const university = universities.find(u => u.id === deadline.universityId);
      
      if (daysUntil >= 0 && daysUntil <= 7) {
        notifications.push({
          id: `deadline-${deadline.id}`,
          type: 'deadline',
          priority: daysUntil <= 1 ? 'high' : daysUntil <= 3 ? 'medium' : 'low',
          title: `${deadline.title} Due Soon`,
          message: `${deadline.title} for ${university?.name} is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
          time: format(new Date(deadline.date), 'MMM d, yyyy'),
          icon: <Calendar className="h-4 w-4" />,
          action: 'View Deadline'
        });
      }
    });

    // Application status updates
    universities.forEach(university => {
      if (university.status === 'applied') {
        notifications.push({
          id: `status-${university.id}`,
          type: 'status',
          priority: 'low',
          title: 'Application Submitted',
          message: `Your application to ${university.name} has been submitted successfully`,
          time: format(new Date(university.updatedAt), 'MMM d, yyyy'),
          icon: <CheckCircle className="h-4 w-4" />,
          action: 'Track Status'
        });
      }
    });

    // Document reminders
    const incompleteDocuments = [
      { name: 'Statement of Purpose', university: 'Stanford' },
      { name: 'Recommendation Letter', university: 'UC Berkeley' }
    ];

    incompleteDocuments.forEach((doc, index) => {
      notifications.push({
        id: `document-${index}`,
        type: 'document',
        priority: 'medium',
        title: 'Document Pending',
        message: `${doc.name} for ${doc.university} needs attention`,
        time: 'Today',
        icon: <FileText className="h-4 w-4" />,
        action: 'Complete Document'
      });
    });

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  };

  const notifications = generateNotifications();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'status':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Enable Notifications</div>
              <div className="text-sm text-muted-foreground">Receive alerts for important deadlines and updates</div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications via email</div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Push Notifications</div>
              <div className="text-sm text-muted-foreground">Receive browser push notifications</div>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Active Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </div>
            <Badge variant="secondary">
              {notifications.length} active
            </Badge>
          </CardTitle>
          <CardDescription>
            Your latest alerts and reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications at this time</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    {notification.action}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Rules</CardTitle>
          <CardDescription>
            Customize when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Deadline Reminders</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>7 days before</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>3 days before</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>1 day before</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>On the day</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Application Updates</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Status changes</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Document uploads</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Interview requests</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Admission decisions</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common notification actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Notification Preferences
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Test Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}